import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { useLedger } from "./use-ledger";

describe("Use Ledger", () => {
	let transport: typeof Transport;
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		transport = createTransportReplayer(RecordStore.fromString(""));
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
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
			return (
				<div>
					{error && <span>{error}</span>}
					{isAwaitingConnection && <span>Waiting Device</span>}
					{isConnected && <span>Connected</span>}

					<button onClick={abortConnectionRetry}>Abort</button>
					<button onClick={() => connect(wallet.coin(), { retries, randomize: false, minTimeout: 10 })}>
						Connect
					</button>
				</div>
			);
		};

		it("should succeed in connecting without retries", async () => {
			const getPublicKeySpy = jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue("012abc");

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
});
