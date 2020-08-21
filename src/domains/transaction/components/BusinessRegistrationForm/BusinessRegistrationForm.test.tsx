
import {  Wallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { act, env,  getDefaultProfileId, render, RenderResult, waitFor } from "utils/testing-library";

import { BusinessRegistrationForm } from "./BusinessRegistrationForm";

// let profile: Profile;
let wallet: Wallet;
// let feeOptions: Record<string, string>;

const renderComponent = async () => {
	let renderer: RenderResult;
	const { result: form } = renderHook(() => useForm());

	await act(async () => {
		renderer = render(
			<FormContext {...form.current}>
				<BusinessRegistrationForm.component activeTab={2} feeOptions={{}} wallet={wallet} />
			</FormContext>,
		);

		await waitFor(() => expect(renderer.getByTestId("BusinessRegistrationForm__step--second")));
	});

	return {
		...renderer!,
		form: form.current,
	};
};

// const createTransactionMock = (wallet: Wallet) =>
// 	// @ts-ignore
// 	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
// 		id: () => delegateRegistrationFixture.data.id,
// 		sender: () => delegateRegistrationFixture.data.sender,
// 		recipient: () => delegateRegistrationFixture.data.recipient,
// 		amount: () => BigNumber.make(delegateRegistrationFixture.data.amount),
// 		fee: () => BigNumber.make(delegateRegistrationFixture.data.fee),
// 		data: () => delegateRegistrationFixture.data,
// 	});

describe("BusinessRegistrationForm", () => {
	// it("should render 2nd step", async () => {
	// 	const { asFragment, getByTestId } = rendered;

	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});

	// 	expect(getByTestId("BusinessRegistrationForm__second-step")).toBeTruthy();
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	// it("should render 3rd step", async () => {
	// 	const { asFragment, getByTestId } = rendered;

	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});

	// 	expect(getByTestId("BusinessRegistrationForm__third-step")).toBeTruthy();
	// 	expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	// it("should render 4th step", async () => {
	// 	const { asFragment, getByTestId } = rendered;

	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});

	// 	expect(getByTestId("BusinessRegistrationForm__fourth-step")).toBeTruthy();
	// 	expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	// it("should render 5th step", async () => {
	// 	const { asFragment, getByTestId } = rendered;

	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__send-button"));
	// 	});

	// 	expect(getByTestId("TransactionSuccessful")).toBeTruthy();
	// 	expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	// it("should submit", async () => {
	// 	const { asFragment, getByTestId } = rendered;

	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__continue-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__send-button"));
	// 	});
	// 	await act(async () => {
	// 		fireEvent.click(getByTestId("BusinessRegistrationForm__download-button"));
	// 	});

	// 	expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	// it("should choose registration type", async () => {
	// 	const { asFragment, getByTestId } = await renderPage();

	// 	expect(getByTestId("BusinessRegistrationForm__first-step")).toBeTruthy();
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		// feeOptions = {
		// 	last: (2 * 1e8).toFixed(0),
		// 	min: "0",
		// 	max: (10 * 1e8).toFixed(0),
		// 	average: (1.354 * 1e8).toFixed(0),
		// };
	});

	it("should render step 2", async () => {
		const { asFragment } = await renderComponent();

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render step 3", async () => {
		const { asFragment, form, getByTestId, rerender } = await renderComponent();

		rerender(
			<FormContext {...form}>
				<BusinessRegistrationForm.component activeTab={3} feeOptions={{}} wallet={wallet} />
			</FormContext>,
		);

		await waitFor(() => expect(getByTestId("BusinessRegistrationForm__step--third")));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	// it("should set username", async () => {
	// 	const { asFragment, form, getByTestId, rerender } = await renderComponent();

	// 	const input = getByTestId("Input__username");
	// 	act(() => {
	// 		fireEvent.change(input, { target: { value: "test_delegate" } });
	// 	});

	// 	await waitFor(() => expect(input).toHaveValue("test_delegate"));
	// 	await waitFor(() => expect(form.getValues("username")).toEqual("test_delegate"));
	// 	await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// });

	// it("should set fee", async () => {
	// 	const { asFragment, form, getByTestId, rerender } = await renderComponent({ fee: "" });

	// 	await act(async () => {
	// 		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0"));
	// 		const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
	// 		fireEvent.click(feeOptions[2]);

	// 		expect(getByTestId("InputCurrency")).not.toHaveValue("0");
	// 		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// 	});
	// });

	it("should sign transaction", async () => {
		const handleNext = jest.fn();

		await BusinessRegistrationForm.signTransaction({
			handleNext,
		});

		expect(handleNext).toHaveBeenCalled();
		// 	const form = {
		// 		clearError: jest.fn(),
		// 		getValues: () => ({
		// 			fee: "1",
		// 			mnemonic: "sample passphrase",
		// 			senderAddress: wallet.address(),
		// 			username: "test_delegate",
		// 		}),
		// 		setError: jest.fn(),
		// 		setValue: jest.fn(),
		// 	};
		// 	const handleNext = jest.fn();
		// 	const setTransaction = jest.fn();

		// 	const signMock = jest
		// 		.spyOn(wallet.transaction(), "signDelegateRegistration")
		// 		.mockReturnValue(Promise.resolve(delegateRegistrationFixture.data.id));
		// 	const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		// 	const transactionMock = createTransactionMock(wallet);

		// 	await BusinessRegistrationForm.signTransaction({
		// 		env,
		// 		form,
		// 		handleNext,
		// 		profile,
		// 		setTransaction,
		// 	});

		// 	expect(signMock).toHaveBeenCalled();
		// 	expect(broadcastMock).toHaveBeenCalled();
		// 	expect(transactionMock).toHaveBeenCalled();
		// 	expect(setTransaction).toHaveBeenCalled();
		// 	expect(handleNext).toHaveBeenCalled();

		// 	signMock.mockRestore();
		// 	broadcastMock.mockRestore();
		// 	transactionMock.mockRestore();
	});

	it("should output transaction details", () => {
		const translations = jest.fn((translation) => translation);

		const { container } = render(<BusinessRegistrationForm.transactionDetails translations={translations} />);

		expect(container).toHaveTextContent("Business Registration");
		expect(container).toHaveTextContent("ROBank Eco");
		expect(container).toHaveTextContent("Not a trustworthy bank");
		expect(container).toHaveTextContent("http://robank.com");
	});
});
