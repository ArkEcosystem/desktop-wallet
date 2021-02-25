import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { useLedgerConnection } from "./connection";

describe("Use Ledger Connection", () => {
	let transport: typeof Transport;
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let publicKeyPaths = new Map();

	beforeEach(() => {
		transport = createTransportReplayer(RecordStore.fromString(""));
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		publicKeyPaths = new Map([
			["44'/1'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/1'/1'/0/0", wallet.publicKey()!],
			["44'/1'/2'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
			["44'/1'/3'/0/0", "033a5474f68f92f254691e93c06a2f22efaf7d66b543a53efcece021819653a200"],
			["44'/1'/4'/0/0", "03d3c6889608074b44155ad2e6577c3368e27e6e129c457418eb3e5ed029544e8d"],
		]);

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it("should listen for device", async () => {
		const Component = () => {
			const { hasDeviceAvailable, error } = useLedgerConnection(transport);
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

	it("should import ledger wallets", async () => {
		const Component = () => {
			const { importLedgerWallets } = useLedgerConnection(transport);
			const wallets = profile.wallets().values();

			const handleImport = async () => {
				const wallets = [{ address: "DQx1w8KE7nEW1nX9gj9iWjMXnp8Q3xyn3y", path: "0" }];
				await importLedgerWallets(wallets, wallet.coin(), profile);
			};

			return (
				<div>
					<ul>
						{wallets.map((wallet) => (
							<li key={wallet.id()} data-testid="Wallet">
								{`${wallet.address()}-${wallet.isLedger() ? "Ledger" : "Standard"}`}
							</li>
						))}
					</ul>
					<button onClick={handleImport}>Import</button>
				</div>
			);
		};

		const unsubscribe = jest.fn();
		let observer: Observer<any>;

		const listenSpy = jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe };
		});

		const { getAllByTestId } = render(<Component />);

		await waitFor(() => {
			expect(getAllByTestId("Wallet").length).toBeGreaterThan(0);
		});

		listenSpy.mockReset();

		act(() => {
			fireEvent.click(screen.getByText("Import"));
		});

		await waitFor(() => {
			expect(getAllByTestId("Wallet").length).toBeGreaterThan(0);
		});

		profile.wallets().forget("DQx1w8KE7nEW1nX9gj9iWjMXnp8Q3xyn3y");
		env.persist();
	});

	describe("Ledger Connection", () => {
		const Component = ({ retries = 3 }: { retries?: number }) => {
			const {
				connect,
				isConnected,
				isAwaitingConnection,
				error,
				abortConnectionRetry,
				disconnect,
			} = useLedgerConnection(transport);
			const handleConnect = async () => {
				try {
					await connect(wallet.coinId(), wallet.networkId(), {
						retries,
						factor: 1,
						randomize: false,
						minTimeout: 10,
					});
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
					<button onClick={() => disconnect(wallet.coin())}>Disconnect</button>
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

			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Connected")).toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(1);

			getPublicKeySpy.mockReset();
		});

		it("should disconnect", async () => {
			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockResolvedValue(publicKeyPaths.values().next().value);

			render(<Component />);

			act(() => {
				fireEvent.click(screen.getByText("Connect"));
			});

			expect(screen.getByText("Waiting Device")).toBeInTheDocument();

			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Connected")).toBeInTheDocument());

			act(() => {
				fireEvent.click(screen.getByText("Disconnect"));
			});

			await waitFor(() => expect(screen.queryByText("Connected")).not.toBeInTheDocument());

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

			act(() => {
				fireEvent.click(screen.getByText("Abort"));
			});

			await waitFor(() => expect(screen.getByText("User aborted")).toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(3);

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

			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Failed")).toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(5);

			getPublicKeySpy.mockReset();
		});
	});

	describe("Ledger Connection with options by default", () => {
		const Component = () => {
			const {
				connect,
				isConnected,
				isAwaitingConnection,
				error,
				abortConnectionRetry,
				disconnect,
			} = useLedgerConnection(transport);
			const handleConnect = async () => {
				try {
					await connect(wallet.coinId(), wallet.networkId());
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
					<button onClick={() => disconnect(wallet.coin())}>Disconnect</button>
				</div>
			);
		};

		it("should succeed in connecting with options by default", async () => {
			const getPublicKeySpy = jest
				.spyOn(wallet.coin().ledger(), "getPublicKey")
				.mockResolvedValue(publicKeyPaths.values().next().value);

			render(<Component />);

			act(() => {
				fireEvent.click(screen.getByText("Connect"));
			});

			expect(screen.getByText("Waiting Device")).toBeInTheDocument();

			await waitFor(() => expect(screen.queryByText("Waiting Device")).not.toBeInTheDocument());
			await waitFor(() => expect(screen.queryByText("Connected")).toBeInTheDocument());

			expect(getPublicKeySpy).toHaveBeenCalledTimes(1);

			getPublicKeySpy.mockReset();
		});
	});
});
