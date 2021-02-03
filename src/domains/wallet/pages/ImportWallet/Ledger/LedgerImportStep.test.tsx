/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts/Ledger/Ledger";
import { LedgerData } from "app/contexts/Ledger/use-ledger";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, render, screen } from "utils/testing-library";

import { LedgerImportStep } from "./LedgerImportStep";

let transport: typeof Transport;
let observer: Observer<any>;

describe("LedgerImportStep", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	const renderComponent = () => {
		const wallets: LedgerData[] = [
			{ address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq", balance: BigNumber.make(0), index: 0 },
			{ address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", balance: BigNumber.make(0), index: 2, isNew: true },
		];

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

	it("should render", async () => {
		const { container, formRef } = renderComponent();

		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		expect(container).toMatchSnapshot();

		await act(async () => {
			fireEvent.input(screen.getAllByTestId("ImportWallet__name-input")[1], {
				target: {
					value: "Custom Name",
				},
			});
		});

		expect(formRef.getValues()).toMatchObject({
			names: { DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq: "", DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES: "Custom Name" },
		});
	});

	it("should show an error message for duplicate name", async () => {
		const { container, getByTestId } = renderComponent();

		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		expect(container).toMatchSnapshot();

		await act(async () => {
			fireEvent.input(screen.getAllByTestId("ImportWallet__name-input")[1], {
				target: {
					value: "ARK Wallet 1",
				},
			});
		});

		// expect(getAllByText("A Wallet named 'ARK Wallet 1' already exists on this profile")).toHaveLength(1);
		const errorMessage = getByTestId("Input-error");
		expect(errorMessage).toBeVisible();
	});

	it("should show an error message for duplicate name in the form", async () => {
		const { container, getByTestId } = renderComponent();

		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		expect(container).toMatchSnapshot();

		for (const input of screen.getAllByTestId("ImportWallet__name-input")) {
			await act(async () => {
				fireEvent.input(input, {
					target: {
						value: "ARK Wallet 3",
					},
				});
			});
		}

		// expect(getAllByText("The name 'ARK Wallet 3' is already assigned to another wallet")).toHaveLength(2);
	});
});
