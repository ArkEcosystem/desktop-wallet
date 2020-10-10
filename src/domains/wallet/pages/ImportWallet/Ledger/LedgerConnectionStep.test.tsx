import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { env, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { LedgerConnectionStep } from "./LedgerConnectionStep";

let transport: typeof Transport;
let observer: Observer<any>;

describe("LedgerConnectionStep", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		transport = createTransportReplayer(RecordStore.fromString(""));

		jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe: jest.fn() };
		});

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it("should emit event on fail", async () => {
		jest.setTimeout(10000);

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockRejectedValue(new Error("Failed"));

		const onFailed = jest.fn();

		const Component = () => {
			const form = useForm({
				defaultValues: {
					network: wallet.network(),
				},
			});
			return (
				<FormProvider {...form}>
					<LedgerProvider transport={transport}>
						<LedgerConnectionStep onFailed={onFailed} />
					</LedgerProvider>
				</FormProvider>
			);
		};

		const { container } = render(<Component />);

		await waitFor(() => expect(screen.queryByText("Open the ARK app on your device...")).toBeInTheDocument());

		await waitFor(() => expect(onFailed).toHaveBeenCalled(), { timeout: 10000 });
		await waitFor(() => expect(screen.queryByText("Failed")).toBeInTheDocument());

		expect(container).toMatchSnapshot();

		getPublicKeySpy.mockReset();
	});
});
