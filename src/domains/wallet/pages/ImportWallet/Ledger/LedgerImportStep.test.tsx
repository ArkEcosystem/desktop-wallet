/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerData } from "app/contexts";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { LedgerImportStep } from "./LedgerImportStep";
import { getDefaultAlias } from "domains/wallet/utils/get-default-alias";

describe("LedgerImportStep", () => {
	let transport: typeof Transport;
	let profile: Contracts.IProfile;

	const derivationPath = "m/44'/1'/0'/0/3";

	const ledgerWallets: LedgerData[] = [
		{ address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq", balance: 0, path: derivationPath },
		{ address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", balance: 0, isNew: true, path: derivationPath },
	];

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		// in Ledger import, wallets are imported after step 3/4
		// so LedgerImportStep assumes that wallets are imported already
		// @TODO maybe refactor step component names

		for (const { address, path } of ledgerWallets) {
			const wallet = await profile.walletFactory().fromAddressWithDerivationPath({
				address,
				coin: "ARK",
				network: "ark.devnet",
				path,
			});

			profile.wallets().push(wallet);

			wallet.mutator().alias(getDefaultAlias({
				profile,
				ticker: "DARK",
			}));
		}

		transport = createTransportReplayer(RecordStore.fromString(""));

		jest.spyOn(transport, "listen").mockImplementationOnce(() => ({ unsubscribe: jest.fn() }));

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();

		for (const { address } of ledgerWallets) {
			const wallet = profile.wallets().findByAddress(address);

			if (wallet) {
				profile.wallets().forget(wallet.id());
			}
		}
	});

	const renderComponent = (wallets: LedgerData[] = ledgerWallets) => {
		let formReference: ReturnType<typeof useForm>;

		const network = profile.wallets().findByAddress(wallets[0].address)?.network();

		const Component = () => {
			const form = useForm<any>({
				defaultValues: { network },
			});

			formReference = form;

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
			// @ts-ignore
			formRef: formReference,
		};
	};

	it("should render with single import", async () => {
		const { container, formRef } = renderComponent(ledgerWallets.slice(1));

		expect(container).toMatchSnapshot();

		await act(async () => {
			fireEvent.input(screen.getByTestId("ImportWallet__name-input"), {
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
		const { container } = renderComponent(ledgerWallets.slice(1));

		expect(container).toMatchSnapshot();

		await act(async () => {
			fireEvent.input(screen.getByTestId("ImportWallet__name-input"), {
				target: {
					value: "ARK Wallet 1",
				},
			});
		});

		expect(screen.getByTestId("ImportWallet__name-input")).toHaveAttribute("aria-invalid");
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
		await waitFor(() => expect(screen.getByTestId("Input__error")).toBeInTheDocument());

		await act(async () => {
			fireEvent.click(screen.getByTestId("UpdateWalletName__cancel"));
			await waitFor(() => expect(screen.queryByTestId("UpdateWalletName__input")).not.toBeInTheDocument());
		});

		expect(container).toMatchSnapshot();
	});
});
