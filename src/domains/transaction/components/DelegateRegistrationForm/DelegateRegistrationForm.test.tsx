import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import delegateRegistrationFixture from "tests/fixtures/coins/ark/transactions/delegate-registration.json";
import { act, env, fireEvent, getDefaultProfileId, render, RenderResult, waitFor, within } from "utils/testing-library";

import { DelegateRegistrationForm } from "./DelegateRegistrationForm";

let profile: Profile;
let wallet: Wallet;
let feeOptions: Record<string, string>;

const renderComponent = async (defaultValues = { fee: (2 * 1e8).toFixed(0) }) => {
	let renderer: RenderResult;
	const { result: form } = renderHook(() =>
		useForm({
			defaultValues,
		}),
	);

	await act(async () => {
		renderer = render(
			<FormContext {...form.current}>
				<DelegateRegistrationForm.component activeTab={2} feeOptions={feeOptions} wallet={wallet} />
			</FormContext>,
		);

		await waitFor(() => expect(renderer.getByTestId("DelegateRegistrationForm__step--second")));
	});

	return {
		...renderer!,
		form: form.current,
	};
};

const createTransactionMock = (wallet: Wallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => delegateRegistrationFixture.data.id,
		sender: () => delegateRegistrationFixture.data.sender,
		recipient: () => delegateRegistrationFixture.data.recipient,
		amount: () => BigNumber.make(delegateRegistrationFixture.data.amount),
		fee: () => BigNumber.make(delegateRegistrationFixture.data.fee),
		data: () => delegateRegistrationFixture.data,
	});

describe("DelegateRegistrationForm", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		feeOptions = {
			last: (2 * 1e8).toFixed(0),
			min: "0",
			max: (10 * 1e8).toFixed(0),
			average: (1.354 * 1e8).toFixed(0),
		};

		// await profile.wallets().importByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", "ARK", "devnet");
	});

	it("should render step 2", async () => {
		const { asFragment } = await renderComponent();

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render step 3", async () => {
		const { asFragment, form, getByTestId, rerender } = await renderComponent();

		rerender(
			<FormContext {...form}>
				<DelegateRegistrationForm.component activeTab={3} feeOptions={feeOptions} wallet={wallet} />
			</FormContext>,
		);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--third")));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should set username", async () => {
		const { asFragment, form, getByTestId, rerender } = await renderComponent();

		const input = getByTestId("Input__username");
		act(() => {
			fireEvent.change(input, { target: { value: "test_delegate" } });
		});

		await waitFor(() => expect(input).toHaveValue("test_delegate"));
		await waitFor(() => expect(form.getValues("username")).toEqual("test_delegate"));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should set fee", async () => {
		const { asFragment, form, getByTestId, rerender } = await renderComponent({ fee: "" });

		await act(async () => {
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[2]);

			expect(getByTestId("InputCurrency")).not.toHaveValue("0");
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should sign transaction", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				username: "test_delegate",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();

		const signMock = jest
			.spyOn(wallet.transaction(), "signDelegateRegistration")
			.mockReturnValue(Promise.resolve(delegateRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await DelegateRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
		});

		expect(signMock).toHaveBeenCalled();
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();
		expect(setTransaction).toHaveBeenCalled();
		expect(handleNext).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should error if signing fails", async () => {
		const form = {
			clearError: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				username: "test_delegate",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const handleNext = jest.fn();
		const setTransaction = jest.fn();
		const translations = jest.fn((translation) => translation);

		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => void 0);
		const signMock = jest.spyOn(wallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
			throw new Error("Signing failed");
		});
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await DelegateRegistrationForm.signTransaction({
			env,
			form,
			handleNext,
			profile,
			setTransaction,
			translations,
		});

		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(form.setValue).toHaveBeenCalledWith("mnemonic", "");
		expect(form.setError).toHaveBeenCalledWith("mnemonic", "manual", "TRANSACTION.INVALID_MNEMONIC");

		expect(broadcastMock).not.toHaveBeenCalled();
		expect(transactionMock).not.toHaveBeenCalled();
		expect(setTransaction).not.toHaveBeenCalled();
		expect(handleNext).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should output transaction details", () => {
		const translations = jest.fn((translation) => translation);
		const transaction = {
			id: () => delegateRegistrationFixture.data.id,
			sender: () => delegateRegistrationFixture.data.sender,
			recipient: () => delegateRegistrationFixture.data.recipient,
			amount: () => BigNumber.make(delegateRegistrationFixture.data.amount),
			fee: () => BigNumber.make(delegateRegistrationFixture.data.fee),
			data: () => delegateRegistrationFixture.data,
		} as Contracts.SignedTransactionData;

		const { getByTestId, getByText } = render(
			<DelegateRegistrationForm.transactionDetails transaction={transaction} translations={translations} />,
		);

		expect(getByText("TRANSACTION.DELEGATE_NAME")).toBeTruthy();
		expect(getByTestId("TransactionDetail")).toHaveTextContent("test_delegate");
	});
});
