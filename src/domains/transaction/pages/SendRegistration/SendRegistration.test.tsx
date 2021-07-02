/* eslint-disable @typescript-eslint/require-await */
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import DelegateRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/delegate-registration.json";
import SecondSignatureRegistrationFixture from "tests/fixtures/coins/ark/devnet/transactions/second-signature-registration.json";
import {
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletMnemonic,
	MNEMONICS,
	renderWithRouter,
	screen,
	syncDelegates,
	syncFees,
	waitFor,
	within,
} from "utils/testing-library";

import { SendRegistration } from ".";

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;
let secondWallet: Contracts.IReadWriteWallet;
const history = createMemoryHistory();
const passphrase = getDefaultWalletMnemonic();

const path = "/profiles/:profileId/wallets/:walletId/send-registration/:registrationType";

const renderPage = async (wallet: Contracts.IReadWriteWallet, type = "delegateRegistration") => {
	const registrationURL = `/profiles/${profile.id()}/wallets/${wallet.id()}/send-registration/${type}`;

	history.push(registrationURL);

	const rendered = renderWithRouter(
		<Route path={path}>
			<SendRegistration />
		</Route>,
		{
			history,
			routes: [registrationURL],
		},
	);

	await waitFor(() => expect(rendered.getByTestId("Registration__form")).toBeTruthy());

	return {
		...rendered,
		history,
	};
};

const createDelegateRegistrationMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		amount: () => +DelegateRegistrationFixture.data.amount / 1e8,
		data: () => ({ data: () => DelegateRegistrationFixture.data }),
		explorerLink: () => `https://dexplorer.ark.io/transaction/${DelegateRegistrationFixture.data.id}`,
		fee: () => +DelegateRegistrationFixture.data.fee / 1e8,
		id: () => DelegateRegistrationFixture.data.id,
		recipient: () => DelegateRegistrationFixture.data.recipient,
		sender: () => DelegateRegistrationFixture.data.sender,
		type: () => "delegateRegistration",
		username: () => DelegateRegistrationFixture.data.asset.delegate.username,
	});

const createSecondSignatureRegistrationMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		amount: () => 0,
		data: () => ({ data: () => SecondSignatureRegistrationFixture.data }),
		explorerLink: () => `https://dexplorer.ark.io/transaction/${SecondSignatureRegistrationFixture.data.id}`,
		fee: () => +SecondSignatureRegistrationFixture.data.fee / 1e8,
		id: () => SecondSignatureRegistrationFixture.data.id,
		recipient: () => SecondSignatureRegistrationFixture.data.recipient,
		sender: () => SecondSignatureRegistrationFixture.data.sender,
		type: () => "secondSignature",
	});

describe("Registration", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().findByAddress("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")!;
		// secondWallet = profile.wallets().findByAddress("D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")!;
		secondWallet = profile.wallets().push(
			await profile.walletFactory().fromAddress({
				address: "DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr",
				coin: "ARK",
				network: "ark.devnet",
			}),
		);

		await wallet.synchroniser().identity();
		await secondWallet.synchroniser().identity();

		profile.wallets().push(
			await profile.walletFactory().fromAddress({
				address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
				coin: "ARK",
				network: "ark.devnet",
			}),
		);

		await syncDelegates(profile);
		await syncFees(profile);
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

		const renderedPage = renderWithRouter(
			<Route path={path}>
				<SendRegistration />
			</Route>,
			{
				history,
				routes: [registrationPath],
			},
		);

		await waitFor(() => expect(renderedPage.getByTestId("Registration__form")).toBeTruthy());
		await waitFor(() => expect(renderedPage.getByTestId("header__title")).toHaveTextContent(label));
	});

	it("should register delegate", async () => {
		const { asFragment, getByTestId, history } = await renderPage(wallet);

		// Step 1
		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });
		await waitFor(() => expect(getByTestId("Input__username")).toHaveValue("test_delegate"));

		const fees = within(getByTestId("InputFee")).getAllByTestId("ButtonGroupOption");
		fireEvent.click(fees[1]);

		fireEvent.click(
			within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
		);

		await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toHaveAttribute("disabled"));

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__back-button"));
		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toHaveAttribute("disabled"));
		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const passwordInput = getByTestId("AuthenticationStep__mnemonic");
		fireEvent.input(passwordInput, { target: { value: passphrase } });
		await waitFor(() => expect(passwordInput).toHaveValue(passphrase));

		await waitFor(() => expect(getByTestId("StepNavigation__send-button")).not.toHaveAttribute("disabled"));

		const signMock = jest
			.spyOn(wallet.transaction(), "signDelegateRegistration")
			.mockReturnValue(Promise.resolve(DelegateRegistrationFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [DelegateRegistrationFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createDelegateRegistrationMock(wallet);

		fireEvent.click(getByTestId("StepNavigation__send-button"));

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
		fireEvent.click(getByTestId("StepNavigation__back-to-wallet-button"));

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		historySpy.mockRestore();
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should register second signature", async () => {
		const bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);

		const { asFragment } = await renderPage(wallet, "secondSignature");

		await waitFor(() =>
			expect(screen.getByTestId("SecondSignatureRegistrationForm__generation-step")).toBeTruthy(),
		);

		const fees = within(screen.getByTestId("InputFee")).getAllByTestId("ButtonGroupOption");
		fireEvent.click(fees[1]);

		fireEvent.click(
			within(screen.getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
		);

		await waitFor(() => expect(screen.getByTestId("InputCurrency")).not.toHaveValue("0"));

		fireEvent.click(screen.getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(screen.getByTestId("SecondSignatureRegistrationForm__backup-step")).toBeTruthy());

		fireEvent.click(screen.getByTestId("StepNavigation__continue-button"));
		await waitFor(() =>
			expect(screen.getByTestId("SecondSignatureRegistrationForm__verification-step")).toBeTruthy(),
		);

		const words = passphrase.split(" ");

		for (let index = 0; index < 3; index++) {
			const wordNumber = Number.parseInt(screen.getByText(/Select the/).innerHTML.replace(/Select the/, ""));

			fireEvent.click(screen.getByText(words[wordNumber - 1]));

			if (index < 2) {
				await waitFor(() => expect(screen.queryAllByText(/The (\d+)/).length === 2 - index));
			}
		}

		await waitFor(() => expect(screen.getByTestId("StepNavigation__continue-button")).not.toBeDisabled());

		fireEvent.click(screen.getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(screen.getByTestId("SecondSignatureRegistrationForm__review-step")).toBeTruthy());

		fireEvent.click(screen.getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(screen.getByTestId("AuthenticationStep")).toBeTruthy());

		fireEvent.input(screen.getByTestId("AuthenticationStep__mnemonic"), { target: { value: passphrase } });
		await waitFor(() => expect(screen.getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

		await waitFor(() => expect(screen.getByTestId("StepNavigation__send-button")).not.toHaveAttribute("disabled"));

		expect(asFragment()).toMatchSnapshot();

		const signMock = jest
			.spyOn(wallet.transaction(), "signSecondSignature")
			.mockReturnValue(Promise.resolve(SecondSignatureRegistrationFixture.data.id));

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [SecondSignatureRegistrationFixture.data.id],
			errors: {},
			rejected: [],
		});

		const transactionMock = createSecondSignatureRegistrationMock(wallet);

		fireEvent.click(screen.getByTestId("StepNavigation__send-button"));

		await waitFor(() => expect(signMock).toHaveBeenCalled());
		await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
		await waitFor(() => expect(transactionMock).toHaveBeenCalled());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();

		bip39GenerateMock.mockRestore();
	});

	it("should set fee", async () => {
		const { getByTestId } = await renderPage(wallet);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.click(
			within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
		);
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("25"));

		fireEvent.click(within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.SIMPLE));

		expect(() => getByTestId("InputCurrency")).toThrow();
	});

	it("should return to form step by cancelling fee warning", async () => {
		const { getByTestId } = await renderPage(wallet);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });

		expect(getByTestId("Input__username")).toHaveValue("test_delegate");

		// Fee
		fireEvent.click(
			within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
		);
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		// Review Step
		expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		// Fee warning
		expect(getByTestId("FeeWarning__cancel-button")).toBeTruthy();

		fireEvent.click(getByTestId("FeeWarning__cancel-button"));

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());
	});

	it("should proceed to authentication step by confirming fee warning", async () => {
		const { getByTestId } = await renderPage(wallet);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.change(getByTestId("Input__username"), { target: { value: "test_delegate" } });

		expect(getByTestId("Input__username")).toHaveValue("test_delegate");

		// Fee
		fireEvent.click(
			within(getByTestId("InputFee")).getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED),
		);
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled());
		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		// Review Step
		expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		// Fee warning
		expect(getByTestId("FeeWarning__continue-button")).toBeTruthy();

		fireEvent.click(getByTestId("FeeWarning__continue-button"));

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
	});

	it("should show mnemonic error", async () => {
		const { getByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue((await secondWallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.change(getByTestId("Input__username"), {
			target: {
				value: "username",
			},
		});
		await waitFor(() => expect(getByTestId("Input__username")).toHaveValue("username"));

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		fireEvent.input(mnemonic, { target: { value: MNEMONICS[0] } });
		await waitFor(() => expect(mnemonic).toHaveValue(MNEMONICS[0]));

		fireEvent.input(secondMnemonic, { target: { value: MNEMONICS[1] } });
		await waitFor(() => expect(secondMnemonic).toHaveValue(MNEMONICS[1]));

		await waitFor(() => expect(getByTestId("StepNavigation__send-button")).not.toBeDisabled());

		const signMock = jest.spyOn(secondWallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
			throw new Error("Signatory should be");
		});

		fireEvent.click(getByTestId("StepNavigation__send-button"));

		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
		await waitFor(() => expect(signMock).toHaveBeenCalled());

		signMock.mockRestore();
		secondPublicKeyMock.mockRestore();
	});

	it("should go back to wallet details", async () => {
		const { getByTestId } = await renderPage(wallet);

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__back-button"));

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		historySpy.mockRestore();
	});

	it("should show error step and go back", async () => {
		const { asFragment, getByTestId } = await renderPage(secondWallet);

		const secondPublicKeyMock = jest
			.spyOn(secondWallet, "secondPublicKey")
			.mockReturnValue((await secondWallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);

		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__form-step")).toBeTruthy());

		fireEvent.change(getByTestId("Input__username"), {
			target: {
				value: "delegate",
			},
		});
		await waitFor(() => expect(getByTestId("Input__username")).toHaveValue("delegate"));

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("DelegateRegistrationForm__review-step")).toBeTruthy());

		await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		const mnemonic = getByTestId("AuthenticationStep__mnemonic");
		const secondMnemonic = getByTestId("AuthenticationStep__second-mnemonic");

		fireEvent.input(mnemonic, { target: { value: MNEMONICS[0] } });
		await waitFor(() => expect(mnemonic).toHaveValue(MNEMONICS[0]));

		fireEvent.input(secondMnemonic, { target: { value: MNEMONICS[1] } });
		await waitFor(() => expect(secondMnemonic).toHaveValue(MNEMONICS[1]));

		await waitFor(() => expect(getByTestId("StepNavigation__send-button")).not.toBeDisabled());

		const signMock = jest.spyOn(secondWallet.transaction(), "signDelegateRegistration").mockImplementation(() => {
			throw new Error();
		});

		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		fireEvent.click(getByTestId("StepNavigation__send-button"));

		await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());

		expect(asFragment()).toMatchSnapshot();

		fireEvent.click(getByTestId("ErrorStep__wallet-button"));

		const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${secondWallet.id()}`;
		await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

		historyMock.mockRestore();
		signMock.mockRestore();
		secondPublicKeyMock.mockRestore();
	});
});
