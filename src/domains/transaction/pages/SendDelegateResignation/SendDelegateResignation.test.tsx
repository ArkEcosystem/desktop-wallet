/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { screen, within } from "@testing-library/react";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import transactionFixture from "tests/fixtures/coins/ark/devnet/transactions/transfer.json";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	MNEMONICS,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendDelegateResignation } from ".";

let wallet: Contracts.IReadWriteWallet;
let profile: Contracts.IProfile;

let resignationUrl: string;

const passphrase = MNEMONICS[0];
const history = createMemoryHistory();

const renderPage = () => {
	const path = "/profiles/:profileId/wallets/:walletId/send-delegate-resignation";

	return renderWithRouter(
		<Route path={path}>
			<SendDelegateResignation />
		</Route>,
		{
			history,
			routes: [resignationUrl],
		},
	);
};

const transactionResponse = {
	amount: () => transactionFixture.data.amount / 1e8,
	data: () => ({ data: () => transactionFixture.data }),
	explorerLink: () => `https://dexplorer.ark.io/transaction/${transactionFixture.data.id}`,
	fee: () => transactionFixture.data.fee / 1e8,
	id: () => transactionFixture.data.id,
	recipient: () => transactionFixture.data.recipient,
	sender: () => transactionFixture.data.sender,
	type: () => "delegateResignation",
};

const createTransactionMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue(transactionResponse);

describe("SendDelegateResignation", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		// wallet = profile.wallets().findById("d044a552-7a49-411c-ae16-8ff407acc430");
		wallet = profile.wallets().push(
			await profile.walletFactory().fromMnemonicWithBIP39({
				coin: "ARK",
				mnemonic: MNEMONICS[0],
				network: "ark.devnet",
			}),
		);
		await wallet.synchroniser().identity();

		await syncDelegates(profile);
		await syncFees(profile);
	});

	describe("Delegate Resignation", () => {
		beforeEach(() => {
			resignationUrl = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}/send-delegate-resignation`;
			history.push(resignationUrl);
		});

		it("should render 1st step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();
		});

		it("should change fee", async () => {
			const { asFragment, getByTestId, getByText } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			// Fee (simple)
			expect(screen.getAllByRole("radio")[1]).toBeChecked();

			fireEvent.click(within(screen.getByTestId("InputFee")).getAllByRole("radio")[2]);
			await waitFor(() => expect(screen.getAllByRole("radio")[2]).toBeChecked());

			// Fee (advanced)
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
			fireEvent.input(getByTestId("InputCurrency"), { target: { value: "1" } });
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("1"));

			expect(asFragment()).toMatchSnapshot();
		});

		it("should render 2nd step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();
		});

		it("should go back to wallet details", async () => {
			const historySpy = jest.spyOn(history, "push").mockImplementation();

			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__back-button"));

			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

			historySpy.mockRestore();
		});

		it("should navigate between 1st and 2nd step", async () => {
			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__back-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
		});

		it("should render 3rd step", async () => {
			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();
		});

		it("should return to form step by cancelling fee warning", async () => {
			const { getByText, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			// Fee
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "30" } });
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("30"));

			await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("FeeWarning__cancel-button")).toBeTruthy());

			fireEvent.click(getByTestId("FeeWarning__cancel-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());
		});

		it("should proceed to authentication step by confirming fee warning", async () => {
			const { getByText, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			// Fee
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
			fireEvent.change(getByTestId("InputCurrency"), { target: { value: "30" } });
			await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("30"));

			await waitFor(() => expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());

			fireEvent.click(getByTestId("FeeWarning__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
		});

		it("should show mnemonic authentication error", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error("Signatory should be");
			});

			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue((await wallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: passphrase,
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
				target: {
					value: MNEMONICS[1],
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue(MNEMONICS[1]));

			fireEvent.click(getByTestId("StepNavigation__send-button"));

			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
			await waitFor(() => expect(getByTestId("StepNavigation__send-button")).toBeDisabled());

			expect(getByTestId("AuthenticationStep")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
		});

		it("should show error step", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error();
			});

			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue((await wallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: passphrase,
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
				target: {
					value: MNEMONICS[1],
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue(MNEMONICS[1]));

			fireEvent.click(getByTestId("StepNavigation__send-button"));

			await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
		});

		it("should show error step and go back", async () => {
			const signMock = jest.spyOn(wallet.transaction(), "signDelegateResignation").mockImplementation(() => {
				throw new Error();
			});

			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue((await wallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: passphrase,
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
				target: {
					value: MNEMONICS[1],
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue(MNEMONICS[1]));

			fireEvent.click(getByTestId("StepNavigation__send-button"));

			await waitFor(() => expect(getByTestId("ErrorStep")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();

			const historyMock = jest.spyOn(history, "push").mockReturnValue();

			fireEvent.click(getByTestId("ErrorStep__wallet-button"));

			const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}`;
			await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

			historyMock.mockRestore();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
		});

		it("should successfully sign and submit resignation transaction", async () => {
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue((await wallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
				accepted: [transactionFixture.data.id],
				errors: {},
				rejected: [],
			});
			const transactionMock = createTransactionMock(wallet);

			const { asFragment, getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: passphrase,
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
				target: {
					value: MNEMONICS[1],
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue(MNEMONICS[1]));

			fireEvent.click(getByTestId("StepNavigation__send-button"));
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});

		it("should back button after successful submission", async () => {
			const secondPublicKeyMock = jest
				.spyOn(wallet, "secondPublicKey")
				.mockReturnValue((await wallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);
			const signMock = jest
				.spyOn(wallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
				accepted: [transactionFixture.data.id],
				errors: {},
				rejected: [],
			});
			const transactionMock = createTransactionMock(wallet);

			const { getByTestId } = renderPage();

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: passphrase,
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

			fireEvent.input(getByTestId("AuthenticationStep__second-mnemonic"), {
				target: {
					value: MNEMONICS[1],
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue(MNEMONICS[1]));

			fireEvent.click(getByTestId("StepNavigation__send-button"));
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			const historyMock = jest.spyOn(history, "push").mockReturnValue();

			fireEvent.click(getByTestId("StepNavigation__back-to-wallet-button"));

			const walletDetailPage = `/profiles/${getDefaultProfileId()}/wallets/${wallet.id()}`;
			await waitFor(() => expect(historyMock).toHaveBeenCalledWith(walletDetailPage));

			historyMock.mockRestore();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
		});

		it("should successfully sign and submit resignation transaction using encryption password", async () => {
			const encryptedWallet = profile.wallets().first();
			await encryptedWallet.synchroniser().identity();

			const actsWithMnemonicMock = jest.spyOn(encryptedWallet, "actsWithMnemonic").mockReturnValue(false);
			const actsWithWifWithEncryptionMock = jest
				.spyOn(encryptedWallet, "actsWithWifWithEncryption")
				.mockReturnValue(true);
			const wifGetMock = jest
				.spyOn(encryptedWallet.wif(), "get")
				.mockResolvedValue("S9rDfiJ2ar4DpWAQuaXECPTJHfTZ3XjCPv15gjxu4cHJZKzABPyV");

			const secondPublicKeyMock = jest
				.spyOn(encryptedWallet, "secondPublicKey")
				.mockReturnValue((await encryptedWallet.coin().publicKey().fromMnemonic(MNEMONICS[1])).publicKey);
			const signMock = jest
				.spyOn(encryptedWallet.transaction(), "signDelegateResignation")
				.mockReturnValue(Promise.resolve(transactionFixture.data.id));
			const broadcastMock = jest.spyOn(encryptedWallet.transaction(), "broadcast").mockResolvedValue({
				accepted: [transactionFixture.data.id],
				errors: {},
				rejected: [],
			});
			const transactionMock = createTransactionMock(encryptedWallet);

			const resignationEncryptedUrl = `/profiles/${getDefaultProfileId()}/wallets/${encryptedWallet.id()}/send-delegate-resignation`;
			history.push(resignationEncryptedUrl);

			const { asFragment, getByTestId } = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/send-delegate-resignation">
					<SendDelegateResignation />
				</Route>,
				{
					history,
					routes: [resignationEncryptedUrl],
				},
			);

			await waitFor(() => expect(getByTestId("SendDelegateResignation__form-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("SendDelegateResignation__review-step")).toBeTruthy());

			fireEvent.click(getByTestId("StepNavigation__continue-button"));
			await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

			fireEvent.input(getByTestId("AuthenticationStep__encryption-password"), {
				target: {
					value: "password",
				},
			});
			await waitFor(() => expect(getByTestId("AuthenticationStep__encryption-password")).toHaveValue("password"));

			await waitFor(() => expect(getByTestId("StepNavigation__send-button")).not.toBeDisabled());

			fireEvent.click(getByTestId("StepNavigation__send-button"));
			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();

			secondPublicKeyMock.mockRestore();
			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();
			actsWithMnemonicMock.mockRestore();
			actsWithWifWithEncryptionMock.mockRestore();
			wifGetMock.mockRestore();
		});
	});
});
