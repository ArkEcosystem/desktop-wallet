import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";
import React, { useState } from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { useLedger } from "./use-ledger";

describe("Use Ledger", () => {
	let transport: typeof Transport;
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let publicKeyPaths = new Map();

	beforeAll(() => {
		nock("https://dwallets.ark.io/api")
			.get("/wallets/DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq")
			.reply(200, {
				data: {
					address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
				},
			})
			.persist();
	});

	beforeEach(() => {
		transport = createTransportReplayer(RecordStore.fromString(""));
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		publicKeyPaths = new Map([
			["44'/111'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/111'/1'/0/0", wallet.publicKey()!],
			["44'/111'/2'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
		]);
	});

	it("should listen for device", async () => {
		const Component = () => {
			const { hasDeviceAvailable, error } = useLedger(transport);
			return (
				<div>
					{error && <span>{error}</span>}
					<span>{hasDeviceAvailable ? "On" : "Off"}</span>
				</div>
			);
		};

		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		render(<Component />);

		act(() => {
			observer!.next({ type: "add", descriptor: "" });
		});

		await waitFor(() => expect(screen.queryByText("On")).toBeInTheDocument());

		act(() => {
			observer!.next({ type: "remove", descriptor: "" });
		});

		await waitFor(() => expect(screen.queryByText("Off")).toBeInTheDocument());

		act(() => {
			observer!.next({ type: "add", descriptor: "", deviceModel: { id: "nanoX" } });
		});

		await waitFor(() => expect(screen.queryByText("On")).toBeInTheDocument());

		act(() => {
			observer.error(new Error("Test Error"));
			observer.complete();
		});

		await waitFor(() => expect(screen.queryByText("Test Error")).toBeInTheDocument());

		listenSpy.mockReset();
	});

	describe("Ledger Connection", () => {
		const Component = ({ retries = 3 }: { retries?: number }) => {
			const { connect, isConnected, isAwaitingConnection, error, abortConnectionRetry } = useLedger(transport);
			const handleConnect = async () => {
				try {
					await connect(wallet.coin(), { retries, randomize: false, minTimeout: 10 });
				} catch {
					//
				}
			};

			return (
				<div>
					{error && <span>{error}</span>}
					{isAwaitingConnection && <span>Waiting Device</span>}
					{isConnected && <span>Connected</span>}

					<button onClick={abortConnectionRetry}>Abort</button>
					<button onClick={handleConnect}>Connect</button>
				</div>
			);
		};

		it("should succeed in connecting without retries", async () => {
			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockResolvedValue(publicKeyPaths.values().next().value);

			render(<Component />);

			act(() => {
				fireEvent.click(screen.getByText("Connect"));
			});

			expect(screen.getByText("Waiting Device")).toBeInTheDocument();

			await waitFor(() => expect(screen.queryByText("Waitig Device")).not.toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Connected")).toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(1);

			getPublicKeySpy.mockReset();
		});

		it("should abort connection retries", async () => {
			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockRejectedValue(new Error("Failed"));

			render(<Component retries={50} />);

			act(() => {
				fireEvent.click(screen.getByText("Connect"));
			});

			await act(() => new Promise((r) => setTimeout(r, 100)));

			act(() => {
				fireEvent.click(screen.getByText("Abort"));
			});

			await waitFor(() => expect(screen.getByText("User aborted")).toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(5);

			getPublicKeySpy.mockReset();
		});

		it("should fail to connect with retries", async () => {
			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockRejectedValue(new Error("Failed"));

			render(<Component />);

			expect(screen.getByText("Connect")).toBeInTheDocument();

			act(() => {
				fireEvent.click(screen.getByText("Connect"));
			});

			expect(screen.getByText("Waiting Device")).toBeInTheDocument();

			await waitFor(() => expect(screen.queryByText("Waitig Device")).not.toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Failed")).toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(4);

			getPublicKeySpy.mockReset();
		});
	});

	describe("Scan Wallets", () => {
		const Component = () => {
			const { scanWallets, isAwaitingConnection, error } = useLedger(transport);
			const [wallets, setWallets] = useState<any>([]);

			const handleScan = async () => {
				const wallets = await scanWallets(wallet.coin(), profile);
				setWallets(wallets);
			};

			return (
				<div>
					{error && <span>{error}</span>}
					{isAwaitingConnection && <span>Waiting Device</span>}
					<ul>
						{wallets.map((wallet) => (
							<li key={wallet.address}>{wallet.address}</li>
						))}
					</ul>
					<button onClick={handleScan}>Scan</button>
				</div>
			);
		};

		it("should scan wallets", async () => {
			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockImplementation((path) => Promise.resolve(publicKeyPaths.get(path)!));

			render(<Component />);

			act(() => {
				fireEvent.click(screen.getByText("Scan"));
			});

			expect(screen.getByText("Waiting Device")).toBeInTheDocument();

			await waitFor(() => expect(screen.getByText("DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq")).toBeInTheDocument());
			await waitFor(() => expect(screen.getByText("DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES")).toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());

			getPublicKeySpy.mockReset();
		});

		it("should fail to scan wallets", async () => {
			jest.useFakeTimers();

			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockRejectedValue(new Error("Failed"));

			render(<Component />);

			act(() => {
				fireEvent.click(screen.getByText("Scan"));
			});

			expect(screen.getByText("Waiting Device")).toBeInTheDocument();

			await waitFor(() => expect(screen.getByText("Failed")).toBeInTheDocument());

			jest.useRealTimers();
			getPublicKeySpy.mockReset();
		});
	});
});
