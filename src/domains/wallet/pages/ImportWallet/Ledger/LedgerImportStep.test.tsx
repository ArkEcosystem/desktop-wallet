/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerData } from "app/contexts";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { LedgerImportStep } from "./LedgerImportStep";

let transport: typeof Transport;
let observer: Observer<any>;

describe("LedgerImportStep", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	const walletsData: LedgerData[] = [
		{ address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq", balance: BigNumber.make(0), index: 0, path: "" },
		{ address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", balance: BigNumber.make(0), index: 2, path: "", isNew: true },
	];

	const renderComponent = (wallets: LedgerData[] = walletsData) => {
		let formRef: ReturnType<typeof useForm>;

		const Component = () => {
			const form = useForm({
				defaultValues: {
					network: wallet.network(),
				},
			});
			formRef = form;
			return (
				<FormProvider {...form}>
					<LedgerProvider transport={transport}>
						<LedgerImportStep wallets={wallets} profile={profile} />
					</LedgerProvider>
				</FormProvider>
			);
		};

		return {
			...render(<Component />),
			formRef,
		};
	};

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

	it("should render with single import", async () => {
		const { container, formRef } = renderComponent(walletsData.slice(1));

		await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(1));
		expect(container).toMatchSnapshot();

		await act(async () => {
			fireEvent.input(screen.getAllByTestId("ImportWallet__name-input")[0], {
				target: {
					value: "Custom Name",
				},
			});
		});

		expect(formRef.getValues()).toMatchObject({
			names: { DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES: "Custom Name" },
		});
	});

	it("should render with multiple import", async () => {
		const { container, formRef } = renderComponent();

		await waitFor(() => expect(screen.getAllByTestId("LedgerImportStep__edit-alias")).toHaveLength(2));

		fireEvent.click(screen.getAllByTestId("LedgerImportStep__edit-alias")[0]);

		await waitFor(() => expect(screen.getByTestId("UpdateWalletName__input")).toBeInTheDocument());

		fireEvent.input(screen.getByTestId("UpdateWalletName__input"), {
			target: {
				value: "Custom Name",
			},
		});

		await waitFor(() => expect(screen.getByTestId("UpdateWalletName__submit")).not.toBeDisabled());

		fireEvent.click(screen.getByTestId("UpdateWalletName__submit"));

		await waitFor(() => expect(screen.queryByTestId("UpdateWalletName__input")).not.toBeInTheDocument());

		expect(formRef.getValues()).toMatchObject({
			names: { DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq: "Custom Name", DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES: undefined },
		});

		expect(container).toMatchSnapshot();
	});

	it("should show an error message for duplicate name", async () => {
		const { container, getByTestId } = renderComponent(walletsData.slice(1));

		expect(screen.getAllByRole("listitem")).toHaveLength(1);
		expect(container).toMatchSnapshot();

		await act(async () => {
			fireEvent.input(screen.getAllByTestId("ImportWallet__name-input")[0], {
				target: {
					value: "ARK Wallet 1",
				},
			});
		});

		expect(getByTestId("Input-error")).toBeVisible();
	});

	it("should show an error message for duplicate name in the form", async () => {
		const { container, formRef } = renderComponent();

		await waitFor(() => expect(screen.getAllByTestId("LedgerImportStep__edit-alias")).toHaveLength(2));

		// First address
		fireEvent.click(screen.getAllByTestId("LedgerImportStep__edit-alias")[0]);

		await waitFor(() => expect(screen.getByTestId("UpdateWalletName__input")).toBeInTheDocument());

		fireEvent.input(screen.getByTestId("UpdateWalletName__input"), {
			target: {
				value: "Custom Name",
			},
		});

		await waitFor(() => expect(screen.getByTestId("UpdateWalletName__submit")).not.toBeDisabled());

		fireEvent.click(screen.getByTestId("UpdateWalletName__submit"));

		await waitFor(() => expect(screen.queryByTestId("UpdateWalletName__input")).not.toBeInTheDocument());

		expect(formRef.getValues()).toMatchObject({
			names: { DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq: "Custom Name", DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES: undefined },
		});

		// Second address
		fireEvent.click(screen.getAllByTestId("LedgerImportStep__edit-alias")[1]);

		await waitFor(() => expect(screen.getByTestId("UpdateWalletName__input")).toBeInTheDocument());

		fireEvent.input(screen.getByTestId("UpdateWalletName__input"), {
			target: {
				value: "Custom Name",
			},
		});

		// Invalid
		await waitFor(() => expect(screen.getByTestId("Input-error")).toBeInTheDocument());

		await act(async () => {
			fireEvent.click(screen.getByTestId("UpdateWalletName__cancel"));
		});

		await waitFor(() => expect(screen.queryByTestId("UpdateWalletName__input")).not.toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});
});
