/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import delegateRegistrationFixture from "tests/fixtures/coins/ark/transactions/delegate-registration.json";
import {
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
	within,
} from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { FirstStep, Registration, SigningStep } from "./Registration";

let profile: Profile;
let wallet: ReadWriteWallet;
let secondWallet: ReadWriteWallet;

const renderPage = async (walletOverride?: ReadWriteWallet) => {
	const history = createMemoryHistory();
	const registrationURL = `/profiles/${profile.id()}/transactions/${(walletOverride || wallet).id()}/registration`;
	history.push(registrationURL);

	let rendered: RenderResult;
	await act(async () => {
		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/registration">
				<Registration />
			</Route>,
			{
				routes: [registrationURL],
				history,
			},
		);

		await waitFor(() => expect(rendered.getByTestId("Registration__form")).toBeTruthy());
		await waitFor(() => expect(rendered.getByTestId("Registration__first-step")).toBeTruthy());
	});

	return {
		...rendered!,
		history,
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

describe("Registration", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		secondWallet = profile.wallets().findByAddress("D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")!;

		await profile.wallets().importByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", "ARK", "devnet");

		await syncDelegates();
		await syncFees();
	});

	beforeEach(() => {
		nock.cleanAll();
		defaultNetMocks();
	});

	it("should render 1st step", async () => {
		const setRegistrationForm = jest.fn();
		const feeOptions = {
			delegateRegistration: {
				average: "1",
			},
		};

		const { result: form } = renderHook(() => useForm());
		const setValueSpy = jest.spyOn(form.current, "setValue");
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<FirstStep
						networks={env.availableNetworks()}
						profile={profile}
						wallet={wallet}
						setRegistrationForm={setRegistrationForm}
						feeOptions={feeOptions}
					/>
				</FormContext>,
			);

			await waitFor(() => expect(rendered.getByTestId("Registration__first-step")).toBeTruthy());
		});

		const { asFragment, getByTestId } = rendered!;

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() =>
				expect(setValueSpy).toHaveBeenNthCalledWith(1, "registrationType", "delegateRegistration", true),
			);
			await waitFor(() => expect(setRegistrationForm).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(setValueSpy).toHaveBeenNthCalledWith(2, "fee", "1", true));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should not set fee if no fee options", async () => {
		const setRegistrationForm = jest.fn();
		const feeOptions = {};

		const { result: form } = renderHook(() => useForm());
		const setValueSpy = jest.spyOn(form.current, "setValue");
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<FirstStep
						networks={env.availableNetworks()}
						profile={profile}
						wallet={wallet}
						setRegistrationForm={setRegistrationForm}
						feeOptions={feeOptions}
					/>
				</FormContext>,
			);

			await waitFor(() => expect(rendered.getByTestId("Registration__first-step")).toBeTruthy());
		});

		const { asFragment, getByTestId } = rendered!;

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() =>
				expect(setValueSpy).toHaveBeenNthCalledWith(1, "registrationType", "delegateRegistration", true),
			);
			await waitFor(() => expect(setRegistrationForm).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(setValueSpy).not.toHaveBeenNthCalledWith(2, "fee", "1", true));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should show encryption password & second mnemonic for signing", async () => {
		const { result: form } = renderHook(() => useForm());

		const { asFragment, container } = render(
			<FormContext {...form.current}>
				<SigningStep passwordType="password" wallet={secondWallet} />
			</FormContext>,
		);

		expect(container).toHaveTextContent(transactionTranslations.ENCRYPTION_PASSWORD);
		expect(container).toHaveTextContent(transactionTranslations.SECOND_MNEMONIC);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should show ledger confirmation & not show second mnemonic for signing", async () => {
		const { result: form } = renderHook(() => useForm());

		const { asFragment, container } = render(
			<FormContext {...form.current}>
				<SigningStep passwordType="ledger" wallet={secondWallet} />
			</FormContext>,
		);

		expect(container).toHaveTextContent(transactionTranslations.LEDGER_CONFIRMATION.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select registration type & show form", async () => {
		const { asFragment, getByTestId } = await renderPage();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());
			await waitFor(() => expect(typeSelectInput).toHaveValue("delegateRegistration"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should change sender & route", async () => {
		const { asFragment, getAllByTestId, getByTestId, history } = await renderPage();

		await act(async () => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const historySpy = jest.spyOn(history, "push");

			const firstAddress = getByTestId("SearchWalletListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const secondWallet = profile.wallets().values()[1];
			await waitFor(() =>
				expect(historySpy).toHaveBeenCalledWith(
					`/profiles/${profile?.id()}/transactions/${secondWallet.id()}/registration`,
				),
			);

			historySpy.mockRestore();
		});
	});

	it("should not have delegate option if wallet is a delegate", async () => {
		const { asFragment, getAllByTestId, getByTestId, history } = await renderPage(secondWallet);

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-0")).toBeTruthy());
			await waitFor(() =>
				expect(() => getByTestId("select-list__toggle-option-1")).toThrow(/Unable to find an element by/),
			);
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should should go back and forth & correctly register fields", async () => {
		const { asFragment, getByTestId } = await renderPage();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__back-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__back-button"));

			await waitFor(() => expect(getByTestId("Registration__first-step")).toBeTruthy());

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__continue-button")).toHaveAttribute("disabled"));

			act(() => {
				fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });
			});

			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should not unregister fields when going back to step 2 onwards", async () => {
		const { asFragment, container, getByTestId } = await renderPage();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__continue-button")).toHaveAttribute("disabled"));

			act(() => {
				fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });
			});

			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));
			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--third")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__back-button")).not.toHaveAttribute("disabled"));
			await waitFor(() => expect(container).toHaveTextContent("test_delegate"));

			fireEvent.click(getByTestId("Registration__back-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));
			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--third")).toBeTruthy());
			await waitFor(() => expect(container).toHaveTextContent("test_delegate"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should register delegate", async () => {
		const { asFragment, getByTestId, history } = await renderPage();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			// Step 1
			fireEvent.click(getByTestId("select-list__toggle-button"));
			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 2
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());

			const input = getByTestId("Input__username");
			act(() => {
				fireEvent.change(input, { target: { value: "test_delegate" } });
			});

			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);

			expect(getByTestId("InputCurrency")).not.toHaveValue("0");
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 3
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--third")).toBeTruthy());

			// Step 4 - signing
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("Registration__signing-step")).toBeTruthy());

			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateRegistration")
				.mockReturnValue(Promise.resolve(delegateRegistrationFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("Registration__send-button"));

			await waitFor(() => expect(signMock).toHaveBeenCalled());
			await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
			await waitFor(() => expect(transactionMock).toHaveBeenCalled());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			// Step 5 - sent screen
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			await waitFor(() => expect(asFragment()).toMatchSnapshot());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("Registration__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should error for invalid mnemonic", async () => {
		const { asFragment, getByTestId, history } = await renderPage();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			// Step 1
			fireEvent.click(getByTestId("select-list__toggle-button"));
			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 2
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());

			const input = getByTestId("Input__username");
			act(() => {
				fireEvent.change(input, { target: { value: "test_delegate" } });
			});

			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);

			expect(getByTestId("InputCurrency")).not.toHaveValue("0");
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 3
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--third")).toBeTruthy());

			// Step 4 - signing
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("Registration__signing-step")).toBeTruthy());

			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			const signMock = jest.spyOn(wallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
				throw new Error();
			});

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			fireEvent.click(getByTestId("Registration__send-button"));

			await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(passwordInput).toHaveValue(""));
			await waitFor(() =>
				expect(getByTestId("Registration__signing-step")).toHaveTextContent(
					transactionTranslations.INVALID_MNEMONIC,
				),
			);

			signMock.mockRestore();

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});
});
