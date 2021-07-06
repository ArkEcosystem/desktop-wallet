/* eslint-disable @typescript-eslint/require-await */
import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { act as hookAct, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import { translations } from "domains/transaction/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import ipfsFixture from "tests/fixtures/coins/ark/devnet/transactions/ipfs.json";
import {
	env,
	fireEvent,
	getDefaultLedgerTransport,
	getDefaultProfileId,
	getDefaultWalletId,
	getDefaultWalletMnemonic,
	render,
	renderWithRouter,
	screen,
	syncFees,
	waitFor,
	within,
} from "utils/testing-library";

import { FormStep, ReviewStep, SendIpfs, SummaryStep } from ".";

const passphrase = getDefaultWalletMnemonic();
const fixtureProfileId = getDefaultProfileId();

const createTransactionMock = (wallet: Contracts.IReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		amount: () => +ipfsFixture.data.amount / 1e8,
		data: () => ({ data: () => ipfsFixture.data }),
		explorerLink: () => `https://dexplorer.ark.io/transaction/${ipfsFixture.data.id}`,
		fee: () => +ipfsFixture.data.fee / 1e8,
		hash: () => ipfsFixture.data.asset.ipfs,
		id: () => ipfsFixture.data.id,
		recipient: () => ipfsFixture.data.recipient,
		sender: () => ipfsFixture.data.sender,
		type: () => "ipfs",
	});

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;
const transport = getDefaultLedgerTransport();

describe("SendIpfs", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(fixtureProfileId);

		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query({ address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD" })
			.reply(200, require("tests/fixtures/coins/ark/devnet/transactions.json"))
			.get("/api/transactions/1e9b975eff66a731095876c3b6cbff14fd4dec3bb37a4127c46db3d69131067e")
			.reply(200, ipfsFixture);

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		await wallet.synchroniser().identity();

		await syncFees(profile);
	});

	it("should render form step", async () => {
		const { result: form } = renderHook(() => useForm());

		await hookAct(async () => {
			const { asFragment } = render(
				<FormProvider {...form.current}>
					<LedgerProvider transport={transport}>
						<FormStep profile={profile} wallet={wallet} />
					</LedgerProvider>
				</FormProvider>,
			);

			await waitFor(() => expect(screen.getByTestId("SendIpfs__form-step")).toBeTruthy());

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render review step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: "0.1",
					hash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
					senderAddress: wallet.address(),
				},
			}),
		);

		hookAct(() => {
			const { asFragment, container, getByTestId } = render(
				<FormProvider {...form.current}>
					<LedgerProvider transport={transport}>
						<ReviewStep wallet={wallet} />
					</LedgerProvider>
				</FormProvider>,
			);

			expect(getByTestId("SendIpfs__review-step")).toBeTruthy();
			expect(container).toHaveTextContent(wallet.network().name());
			expect(container).toHaveTextContent("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
			expect(container).toHaveTextContent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render summary step", async () => {
		const { result: form } = renderHook(() => useForm());

		const transaction = new DTO.ExtendedSignedTransactionData(
			await wallet
				.coin()
				.transaction()
				.ipfs({
					data: {
						hash: ipfsFixture.data.asset.ipfs,
					},
					fee: "1",
					nonce: "1",
					signatory: await wallet
						.coin()
						.signatory()
						.multiSignature(2, [wallet.publicKey()!, profile.wallets().last().publicKey()!]),
				}),
		);

		hookAct(() => {
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<LedgerProvider transport={transport}>
						<SummaryStep transaction={transaction} />
					</LedgerProvider>
				</FormProvider>,
			);

			expect(getByTestId("TransactionSuccessful")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should navigate between steps", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__back-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
	});

	it("should send an IPFS transaction and go back to wallet page", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		expect(within(getByTestId("InputFee")).getAllByRole("radio")[1]).toBeChecked();

		fireEvent.click(within(getByTestId("InputFee")).getAllByRole("radio")[2]);
		await waitFor(() => expect(within(getByTestId("InputFee")).getAllByRole("radio")[2]).toBeChecked());

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), { target: { value: passphrase } });
		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

		// Step 4
		const signMock = jest
			.spyOn(wallet.transaction(), "signIpfs")
			.mockReturnValue(Promise.resolve(ipfsFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [ipfsFixture.data.id],
			errors: {},
			rejected: [],
		});
		const transactionMock = createTransactionMock(wallet);

		await waitFor(() => expect(getByTestId("StepNavigation__send-button")).not.toBeDisabled());

		fireEvent.click(getByTestId("StepNavigation__send-button"));
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
			"1e9b975eff66a731095876c3b6cbff14fd4dec3bb37a4127c46db3d69131067e",
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();

		expect(container).toMatchSnapshot();

		// Go back to wallet
		const historySpy = jest.spyOn(history, "push");

		fireEvent.click(getByTestId("StepNavigation__back-to-wallet-button"));

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		historySpy.mockRestore();

		expect(container).toMatchSnapshot();
	});

	it("should return to form step by cancelling fee warning", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		expect(getByTestId("FeeWarning__cancel-button")).toBeTruthy();

		fireEvent.click(getByTestId("FeeWarning__cancel-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());
	});

	it("should proceed to authentication step by confirming fee warning", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		// Fee
		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());

		fireEvent.click(getByTestId("FeeWarning__continue-button"));
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());
	});

	it("should error if wrong mnemonic", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		// Fee
		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		// Auth Step
		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), { target: { value: passphrase } });
		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

		const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => undefined);
		// Summary Step (skip ledger confirmation for now)
		const signMock = jest.spyOn(wallet.transaction(), "signIpfs").mockImplementation(() => {
			throw new Error("Signatory should be");
		});

		fireEvent.click(getByTestId("StepNavigation__send-button"));

		await waitFor(() => expect(signMock).toHaveBeenCalled());
		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(""));
		await waitFor(() => {
			expect(getByTestId("Input__error")).toBeVisible();
		});

		signMock.mockRestore();
		consoleErrorMock.mockRestore();

		await waitFor(() => expect(container).toMatchSnapshot());
	});

	it("should go back to wallet details", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const historySpy = jest.spyOn(history, "push").mockImplementation();

		fireEvent.click(getByTestId("StepNavigation__back-button"));

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);

		historySpy.mockRestore();
	});

	it("should show error step and go back", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		fireEvent.input(getByTestId("AuthenticationStep__mnemonic"), { target: { value: passphrase } });
		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue(passphrase));

		// Step 5 (skip step 4 for now - ledger confirmation)
		const signMock = jest.spyOn(wallet.transaction(), "signIpfs").mockImplementation(() => {
			throw new Error();
		});

		fireEvent.click(getByTestId("StepNavigation__send-button"));

		await waitFor(() => expect(getByTestId("ErrorStep")).toBeInTheDocument());

		expect(getByTestId("ErrorStep__wallet-button")).toBeInTheDocument();
		expect(container).toMatchSnapshot();

		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		fireEvent.click(getByTestId("ErrorStep__wallet-button"));

		expect(historyMock).toHaveBeenCalledWith(`/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}`);

		signMock.mockRestore();
	});

	it("should show an error if an invalid IPFS hash is entered", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${wallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "invalid-ipfs-hash" },
		});
		await waitFor(() => expect(getByTestId("Input__hash")).toHaveValue("invalid-ipfs-hash"));

		expect(getByTestId("Input__error")).toBeVisible();

		expect(container).toMatchSnapshot();
	});

	it("should send an ipfs transaction with a multisig wallet", async () => {
		const isMultiSignatureSpy = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
		const multisignatureSpy = jest
			.spyOn(wallet.multiSignature(), "all")
			.mockReturnValue({ min: 2, publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!] });

		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText, container } = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		// Step 4
		const signMock = jest
			.spyOn(wallet.transaction(), "signIpfs")
			.mockReturnValue(Promise.resolve(ipfsFixture.data.id));

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [ipfsFixture.data.id],
			errors: {},
			rejected: [],
		});

		const transactionMock = createTransactionMock(wallet);

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		expect(getByTestId("TransactionSuccessful")).toHaveTextContent(
			"1e9b975eff66a731095876c3b6cbff14fd4dec3bb37a4127c46db3d69131067e",
		);

		expect(signMock).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.anything(),
				fee: expect.any(Number),
				nonce: expect.any(String),
				signatory: expect.any(Object),
			}),
		);

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		multisignatureSpy.mockRestore();
		isMultiSignatureSpy.mockRestore();

		expect(container).toMatchSnapshot();
	});

	it("should send a ipfs transfer with a ledger wallet", async () => {
		jest.spyOn(wallet.coin(), "__construct").mockImplementation();

		const isLedgerSpy = jest.spyOn(wallet, "isLedger").mockImplementation(() => true);

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockResolvedValue("0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb");

		const signTransactionSpy = jest
			.spyOn(wallet.transaction(), "signIpfs")
			.mockReturnValue(Promise.resolve(ipfsFixture.data.id));

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [ipfsFixture.data.id],
			errors: {},
			rejected: [],
		});

		const transactionMock = createTransactionMock(wallet);

		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText, container } = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(wallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		// Auto broadcast
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		getPublicKeySpy.mockRestore();
		broadcastMock.mockRestore();
		isLedgerSpy.mockRestore();
		signTransactionSpy.mockRestore();
		transactionMock.mockRestore();

		expect(container).toMatchSnapshot();
	});

	it("should send an IPFS transaction using encryption password", async () => {
		const encryptedWallet = profile.wallets().first();
		const actsWithMnemonicMock = jest.spyOn(encryptedWallet, "actsWithMnemonic").mockReturnValue(false);
		const actsWithWifWithEncryptionMock = jest
			.spyOn(encryptedWallet, "actsWithWifWithEncryption")
			.mockReturnValue(true);
		const wifGetMock = jest
			.spyOn(encryptedWallet.wif(), "get")
			.mockResolvedValue("S9rDfiJ2ar4DpWAQuaXECPTJHfTZ3XjCPv15gjxu4cHJZKzABPyV");

		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/wallets/${encryptedWallet.id()}/send-ipfs`;

		history.push(ipfsURL);

		const { getByTestId, getByText, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId/send-ipfs">
				<LedgerProvider transport={transport}>
					<SendIpfs />
				</LedgerProvider>
			</Route>,
			{
				history,
				routes: [ipfsURL],
			},
		);

		await waitFor(() => expect(getByTestId("SendIpfs__form-step")).toBeTruthy());

		const networkLabel = `${wallet.network().coin()} ${wallet.network().name()}`;
		await waitFor(() => expect(getByTestId("TransactionNetwork")).toHaveTextContent(networkLabel));
		await waitFor(() => expect(getByTestId("TransactionSender")).toHaveTextContent(encryptedWallet.address()));

		fireEvent.input(getByTestId("Input__hash"), {
			target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
		});
		await waitFor(() =>
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"),
		);

		fireEvent.click(getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		fireEvent.change(getByTestId("InputCurrency"), { target: { value: "10" } });
		await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("10"));

		expect(getByTestId("StepNavigation__continue-button")).not.toBeDisabled();

		fireEvent.click(getByTestId("StepNavigation__continue-button"));
		await waitFor(() => expect(getByTestId("SendIpfs__review-step")).toBeTruthy());

		fireEvent.click(getByTestId("StepNavigation__continue-button"));

		if (!profile.settings().get(Contracts.ProfileSetting.DoNotShowFeeWarning)) {
			await waitFor(() => expect(getByTestId("FeeWarning__continue-button")).toBeTruthy());
			fireEvent.click(getByTestId("FeeWarning__continue-button"));
		}

		await waitFor(() => expect(getByTestId("AuthenticationStep")).toBeTruthy());

		fireEvent.input(getByTestId("AuthenticationStep__encryption-password"), { target: { value: "password" } });
		await waitFor(() => expect(getByTestId("AuthenticationStep__encryption-password")).toHaveValue("password"));

		const signMock = jest
			.spyOn(encryptedWallet.transaction(), "signIpfs")
			.mockReturnValue(Promise.resolve(ipfsFixture.data.id));

		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockResolvedValue({
			accepted: [ipfsFixture.data.id],
			errors: {},
			rejected: [],
		});

		const transactionMock = createTransactionMock(encryptedWallet);

		await waitFor(() => expect(getByTestId("StepNavigation__send-button")).not.toBeDisabled());

		fireEvent.click(getByTestId("StepNavigation__send-button"));
		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
		actsWithMnemonicMock.mockRestore();
		actsWithWifWithEncryptionMock.mockRestore();
		wifGetMock.mockRestore();

		expect(container).toMatchSnapshot();
	});
});
