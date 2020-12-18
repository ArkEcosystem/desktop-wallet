/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import DelegateRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/delegate-registration.json";
import {
	act,
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletMnemonic,
	RenderResult,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
	within,
} from "utils/testing-library";

import { SendRegistration } from "./";

let profile: Profile;
let wallet: ReadWriteWallet;
let secondWallet: ReadWriteWallet;
const history = createMemoryHistory();
const passphrase = getDefaultWalletMnemonic();

const path = "/profiles/:profileId/wallets/:walletId/send-registration/:registrationType";

const renderPage = async (wallet: ReadWriteWallet, type = "delegateRegistration") => {
	const registrationURL = `/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/${type}`;

	history.push(registrationURL);

	let rendered: RenderResult;
	await act(async () => {
		rendered = renderWithRouter(
			<Route path={path}>
				<SendRegistration />
			</Route>,
			{
				routes: [registrationURL],
				history,
			},
		);

		await waitFor(() => expect(rendered.getByTestId("Registration__form")).toBeTruthy());
	});

	return {
		...rendered!,
		history,
	};
};

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => DelegateRegistrationFixture.data.id,
		sender: () => DelegateRegistrationFixture.data.sender,
		recipient: () => DelegateRegistrationFixture.data.recipient,
		amount: () => BigNumber.make(DelegateRegistrationFixture.data.amount),
		fee: () => BigNumber.make(DelegateRegistrationFixture.data.fee),
		data: () => DelegateRegistrationFixture.data,
	});

describe("Registration", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		secondWallet = profile.wallets().findByAddress("D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")!;

		await profile.wallets().importByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", "ARK", "ark.devnet");

		await syncDelegates();
		await syncFees();
	});

	beforeEach(() => {
		nock.cleanAll();
		defaultNetMocks();

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"));
	});

	it.each([
		["delegateRegistration", "Register Delegate"],
		["secondSignature", "Register Second Signature"],
		["multiSignature", "Multisignature Registration"],
	])("should handle registrationType param (%s)", async (type, label) => {
		const registrationPath = `/profiles/${getDefaultProfileId()}/wallets/${secondWallet.id()}/send-registration/${type}`;
		history.push(registrationPath);

		await act(async () => {
			const renderedPage = renderWithRouter(
				<Route path={path}>
					<SendRegistration />
				</Route>,
				{
					routes: [registrationPath],
					history,
				},
			);

			await waitFor(() => expect(renderedPage.getByTestId("Registration__form")).toBeTruthy());
			await waitFor(() => expect(renderedPage.getByTestId("header__title")).toHaveTextContent(label));
		});
	});

	// it("should not set fee if no fee options", async () => {
	// 	const setRegistrationForm = jest.fn();
	// 	const network = {
	// 		id: () => "ark.devnet",
	// 		coin: () => "ARK",
	// 		can: () => true,
	// 	};
	// 	const fees = {};

	// 	const { result: form } = renderHook(() =>
	// 		useForm({
	// 			defaultValues: {
	// 				network,
	// 			},
	// 		}),
	// 	);
	// 	const setValueSpy = jest.spyOn(form.current, "setValue");
	// 	let rendered: RenderResult;

	// 	await renderHookAct(async () => {
	// 		rendered = render(
	// 			<FormProvider {...form.current}>
	// 				<RegistrationTypeStep
	// 					networks={env.availableNetworks()}
	// 					profile={profile}
	// 					wallet={wallet}
	// 					setRegistrationForm={setRegistrationForm}
	// 					fees={fees}
	// 				/>
	// 			</FormProvider>,
	// 		);

	// 		await waitFor(() => expect(rendered.getByTestId("Registration__selection-step")).toBeTruthy());
	// 	});

	// 	const { asFragment, getByTestId } = rendered!;

	// 	await renderHookAct(async () => {
	// 		fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));

	// 		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Delegate")).toBeTruthy());

	// 		fireEvent.click(getByTestId("RegistrationTypeIcon-Delegate"));

	// 		await waitFor(() => expect(setValueSpy).toHaveBeenNthCalledWith(1, "network", { ...network }));
	// 		await waitFor(() =>
	// 			expect(setValueSpy).toHaveBeenNthCalledWith(
	// 				2,
	// 				"registrationType",
	// 				{ label: "Delegate", value: "delegateRegistration" },
	// 				{ shouldValidate: true, shouldDirty: true },
	// 			),
	// 		);
	// 		await waitFor(() => expect(setRegistrationForm).toHaveBeenCalledTimes(1));
	// 		await waitFor(() => expect(setValueSpy).not.toHaveBeenNthCalledWith(3, "fee", "1", true));
	// 		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	// 	});
	// });

	it("should register delegate", async () => {
		const { asFragment, getByTestId, history } = await renderPage(wallet);

		await act(async () => {
			// Step 1
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

			const input = getByTestId("Input__username");
			act(() => {
				fireEvent.change(input, { target: { value: "test_delegate" } });
			});

			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);

			expect(getByTestId("InputCurrency")).not.toHaveValue("0");
			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			// Step 2
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());

			// Step 3 - signing
			fireEvent.click(getByTestId("Registration__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			const passwordInput = getByTestId("AuthenticationStep__mnemonic");
			fireEvent.input(passwordInput, { target: { value: passphrase } });
			await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

			await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));

			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateRegistration")
				.mockReturnValue(Promise.resolve(DelegateRegistrationFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("Registration__send-button"));

			await waitFor(() => expect(signMock).toHaveBeenCalled());
			await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
			await waitFor(() => expect(transactionMock).toHaveBeenCalled());

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			// Step 4 - summary screen
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("Registration__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should set fee", async () => {
		const { getByTestId, getAllByTestId } = await renderPage(wallet);

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		act(() => {
			fireEvent.click(getAllByTestId("SelectionBarOption")[1]);
		});

		const feeInput = getByTestId("InputCurrency");
		waitFor(() => expect(feeInput).toHaveValue("0"));
	});

	it("should show mnemonic error", async () => {
		const { getByTestId, queryAllByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue(await secondWallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("Input__username"), {
				target: {
					value: "username",
				},
			});
		});
		await waitFor(() => expect(getByTestId("Input__username")).toHaveValue("username"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());
		await waitFor(() => expect(getByTestId("Registration__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		act(() => {
			fireEvent.input(mnemonic, { target: { value: "v3wallet2" } });
		});

		act(() => {
			fireEvent.input(secondMnemonic, { target: { value: "second mnemonic" } });
		});

		await waitFor(() => expect(mnemonic).toHaveValue("v3wallet2"));
		await waitFor(() => expect(secondMnemonic).toHaveValue("second mnemonic"));

		await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));
		await waitFor(() => expect(getByTestId("Registration__send-button")).toBeTruthy());

		const signMock = jest.spyOn(secondWallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
			throw new Error("Signatory should be");
		});

		act(() => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
		await waitFor(() => expect(signMock).toHaveBeenCalled());

		signMock.mockRestore();
		secondPublicKeyMock.mockRestore();
	});

	it("should show error step and go back", async () => {
		const { asFragment, getByTestId, queryAllByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue(await secondWallet.coin().identity().publicKey().fromMnemonic("second mnemonic"));

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		act(() => {
			fireEvent.change(getByTestId("Input__username"), {
				target: {
					value: "delegate",
				},
			});
		});
		await waitFor(() => expect(getByTestId("Input__username")).toHaveValue("delegate"));

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());
		await waitFor(() => expect(getByTestId("Registration__continue-button")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("Registration__continue-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		act(() => {
			fireEvent.input(mnemonic, { target: { value: "v3wallet2" } });
		});

		act(() => {
			fireEvent.input(secondMnemonic, { target: { value: "second mnemonic" } });
		});

		await waitFor(() => expect(mnemonic).toHaveValue("v3wallet2"));
		await waitFor(() => expect(secondMnemonic).toHaveValue("second mnemonic"));

		await waitFor(() => expect(getByTestId("Registration__send-button")).not.toHaveAttribute("disabled"));
		await waitFor(() => expect(getByTestId("Registration__send-button")).toBeTruthy());

		const signMock = jest.spyOn(secondWallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
			throw new Error();
		});

		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		act(() => {
			fireEvent.click(getByTestId("Registration__send-button"));
		});

		await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("ErrorStep__wallet-button"));
		});

		const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${secondWallet.id()}`;
		await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

		historyMock.mockRestore();
		signMock.mockRestore();
		secondPublicKeyMock.mockRestore();
	});
});
