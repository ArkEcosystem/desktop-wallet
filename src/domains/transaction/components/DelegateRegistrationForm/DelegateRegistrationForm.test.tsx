/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import delegateRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/delegate-registration.json";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	RenderResult,
	syncDelegates,
	waitFor,
	within,
} from "utils/testing-library";

import { DelegateRegistrationForm } from "./DelegateRegistrationForm";

let profile: Profile;
let wallet: ReadWriteWallet;
let fees: Record<string, string>;

const renderComponent = async (defaultValues = { fee: (2 * 1e8).toFixed(0) }) => {
	let renderer: RenderResult;
	const { result: form } = renderHook(() =>
		useForm({
			defaultValues,
		}),
	);

	await act(async () => {
		renderer = render(
			<FormProvider {...form.current}>
				<DelegateRegistrationForm.component activeTab={1} fees={fees} wallet={wallet} />
			</FormProvider>,
		);

		await waitFor(() => expect(renderer.getByTestId("DelegateRegistrationForm__form-step")));
	});

	return {
		...renderer!,
		form: form.current,
	};
};

const createTransactionMock = (wallet: ReadWriteWallet) =>
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
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await syncDelegates();

		fees = {
			min: "0",
			max: (10 * 1e8).toFixed(0),
			avg: (1.354 * 1e8).toFixed(0),
		};
	});

	it("should render form step", async () => {
		const { asFragment } = await renderComponent();

		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should render review step", async () => {
		const { asFragment, form, getByTestId, rerender } = await renderComponent();

		rerender(
			<FormProvider {...form}>
				<DelegateRegistrationForm.component activeTab={2} fees={fees} wallet={wallet} />
			</FormProvider>,
		);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should set username", async () => {
		const { asFragment, form, getByTestId, rerender } = await renderComponent();

		const input = getByTestId("Input__username");
		await act(async () => {
			fireEvent.change(input, { target: { value: "test_delegate" } });
		});

		await act(async () => {
			rerender(
				<FormProvider {...form}>
					<DelegateRegistrationForm.component activeTab={1} fees={fees} wallet={wallet} />
				</FormProvider>,
			);

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")));
		});

		await waitFor(() => expect(input).toHaveValue("test_delegate"));
		await waitFor(() => expect(form.getValues("username")).toEqual("test_delegate"));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should set fee", async () => {
		const { asFragment, getByTestId } = await renderComponent({ fee: "100000000" });

		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

		await act(async () => {
			const fees = within(getByTestId("InputFee")).getAllByTestId("ButtonGroupOption");
			fireEvent.click(fees[2]);
		});

		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should show error if username contains illegal characters", async () => {
		const { asFragment, form, getByTestId, getByText, rerender } = await renderComponent();

		await act(async () => {
			fireEvent.change(getByTestId("Input__username"), { target: { value: "<invalid>" } });
		});

		await act(async () => {
			rerender(
				<FormProvider {...form}>
					<DelegateRegistrationForm.component activeTab={1} fees={fees} wallet={wallet} />
				</FormProvider>,
			);

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")));
		});

		expect(getByTestId("Input__username")).toHaveAttribute("aria-invalid");
		expect(getByTestId("Input-error")).toBeVisible();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should error if username is too long", async () => {
		const { asFragment, form, getByTestId, getByText, rerender } = await renderComponent();

		await act(async () => {
			fireEvent.change(getByTestId("Input__username"), {
				target: { value: "thisisaveryveryverylongdelegatename" },
			});
		});

		await act(async () => {
			rerender(
				<FormProvider {...form}>
					<DelegateRegistrationForm.component activeTab={1} fees={fees} wallet={wallet} />
				</FormProvider>,
			);

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")));
		});

		expect(getByTestId("Input__username")).toHaveAttribute("aria-invalid");
		expect(getByTestId("Input-error")).toBeVisible();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show error if username already exists", async () => {
		const { asFragment, form, getByTestId, getByText, rerender } = await renderComponent();

		await act(async () => {
			fireEvent.change(getByTestId("Input__username"), { target: { value: "arkx" } });
		});

		await act(async () => {
			rerender(
				<FormProvider {...form}>
					<DelegateRegistrationForm.component activeTab={1} fees={fees} wallet={wallet} />
				</FormProvider>,
			);

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")));
		});

		expect(getByTestId("Input__username")).toHaveAttribute("aria-invalid");
		expect(getByTestId("Input-error")).toBeVisible();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should sign transaction", async () => {
		const form = {
			clearErrors: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				username: "test_delegate",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const signMock = jest
			.spyOn(wallet.transaction(), "signDelegateRegistration")
			.mockReturnValue(Promise.resolve(delegateRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		await DelegateRegistrationForm.signTransaction({
			env,
			form,
			profile,
		});

		expect(signMock).toHaveBeenCalled();
		expect(broadcastMock).toHaveBeenCalled();
		expect(transactionMock).toHaveBeenCalled();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should error if signing fails", async () => {
		const form = {
			clearErrors: jest.fn(),
			getValues: () => ({
				fee: "1",
				mnemonic: "sample passphrase",
				senderAddress: wallet.address(),
				username: "test_delegate",
			}),
			setError: jest.fn(),
			setValue: jest.fn(),
		};
		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => void 0);
		const signMock = jest.spyOn(wallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
			throw new Error("Signing failed");
		});
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
		const transactionMock = createTransactionMock(wallet);

		try {
			await DelegateRegistrationForm.signTransaction({
				env,
				form,
				profile,
			});
			// eslint-disable-next-line
		} catch (error) {}

		await waitFor(() => expect(signMock).toThrow());

		expect(broadcastMock).not.toHaveBeenCalled();
		expect(transactionMock).not.toHaveBeenCalled();

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

		const { getByText } = render(
			<DelegateRegistrationForm.transactionDetails
				transaction={transaction}
				translations={translations}
				wallet={wallet}
			/>,
		);

		expect(getByText("TRANSACTION.DELEGATE_NAME")).toBeTruthy();
		expect(getByText("test_delegate")).toBeTruthy();
	});
});
