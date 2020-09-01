/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	RenderResult,
	renderWithRouter,
	waitFor,
	within,
} from "testing-library";
import ipfsFixture from "tests/fixtures/coins/ark/transactions/ipfs.json";

import { translations as transactionTranslations } from "../../i18n";
import { FirstStep, FourthStep, SecondStep, SendIPFSTransaction, ThirdStep } from "./SendIPFSTransaction";

const fixtureProfileId = getDefaultProfileId();

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => ipfsFixture.data.id,
		sender: () => ipfsFixture.data.sender,
		recipient: () => ipfsFixture.data.recipient,
		amount: () => BigNumber.make(ipfsFixture.data.amount),
		fee: () => BigNumber.make(ipfsFixture.data.fee),
		data: () => ipfsFixture.data,
	});

let profile: Profile;
let wallet: ReadWriteWallet;

describe("SendIPFSTransaction", () => {
	beforeAll(async () => {
		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		wallet = profile.wallets().values()[0];

		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.get("/api/transactions/1e9b975eff66a731095876c3b6cbff14fd4dec3bb37a4127c46db3d69131067e")
			.reply(200, ipfsFixture);
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep networks={[]} profile={profile} />
			</FormContext>,
		);

		expect(getByTestId("SendIPFSTransaction__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: (0.1 * 1e8).toFixed(0),
					hash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
					senderAddress: wallet.address(),
				},
			}),
		);

		const { asFragment, container, getByTestId } = render(
			<FormContext {...form.current}>
				<SecondStep wallet={wallet} />
			</FormContext>,
		);

		expect(getByTestId("SendIPFSTransaction__step--second")).toBeTruthy();
		expect(container).toHaveTextContent(wallet.network().name());
		expect(container).toHaveTextContent("D8rr7B…s6YUYD");
		expect(container).toHaveTextContent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("SendIPFSTransaction__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const transaction = (await wallet.transactions()).findById(
			"1e9b975eff66a731095876c3b6cbff14fd4dec3bb37a4127c46db3d69131067e",
		);
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep transaction={transaction!} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate between steps", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/ipfs`;

		history.push(ipfsURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/ipfs">
					<SendIPFSTransaction />
				</Route>,
				{
					routes: [ipfsURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId(`SendIPFSTransaction__step--first`)).toBeTruthy());
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			await waitFor(() =>
				expect(rendered.getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200"),
			);
			await waitFor(() => expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(wallet.address()));

			// Hash
			fireEvent.input(getByTestId("Input__hash"), {
				target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
			});
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendIPFSTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendIPFSTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendIPFSTransaction__button--back"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendIPFSTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 4
			const signMock = jest
				.spyOn(wallet.transaction(), "signIpfs")
				.mockReturnValue(Promise.resolve(ipfsFixture.data.id));
			const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockImplementation();
			const transactionMock = createTransactionMock(wallet);

			fireEvent.click(getByTestId("SendIPFSTransaction__button--submit"));

			await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
			expect(getByTestId("TransactionSuccessful")).toHaveTextContent("1e9b975eff66a7…6db3d69131067e");

			// Copy Transaction
			const copyMock = jest.fn();
			const clipboardOriginal = navigator.clipboard;

			// @ts-ignore
			navigator.clipboard = { writeText: copyMock };

			fireEvent.click(getByTestId(`SendIPFSTransaction__button--copy`));

			await waitFor(() => expect(copyMock).toHaveBeenCalledWith(ipfsFixture.data.id));

			// @ts-ignore
			navigator.clipboard = clipboardOriginal;

			signMock.mockRestore();
			broadcastMock.mockRestore();
			transactionMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());

			// Go back to wallet
			const historySpy = jest.spyOn(history, "push");
			fireEvent.click(getByTestId("SendIPFSTransaction__button--back-to-wallet"));
			expect(historySpy).toHaveBeenCalledWith(`/profiles/${profile.id()}/wallets/${wallet.id()}`);
			historySpy.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should error if wrong mnemonic", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/ipfs`;

		history.push(ipfsURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/ipfs">
					<SendIPFSTransaction />
				</Route>,
				{
					routes: [ipfsURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId(`SendIPFSTransaction__step--first`)).toBeTruthy());
		});

		const { getByTestId } = rendered!;

		await act(async () => {
			// Hash
			fireEvent.input(getByTestId("Input__hash"), {
				target: { value: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
			});
			expect(getByTestId("Input__hash")).toHaveValue("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");

			// Fee
			await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			// Step 2
			fireEvent.click(getByTestId("SendIPFSTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendIPFSTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--third")).toBeTruthy());

			// Back to Step 2
			fireEvent.click(getByTestId("SendIPFSTransaction__button--back"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--second")).toBeTruthy());

			// Step 3
			fireEvent.click(getByTestId("SendIPFSTransaction__button--continue"));
			await waitFor(() => expect(getByTestId("SendIPFSTransaction__step--third")).toBeTruthy());
			const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
			fireEvent.input(passwordInput, { target: { value: "passphrase" } });
			await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

			// Step 5 (skip step 4 for now - ledger confirmation)
			const signMock = jest.spyOn(wallet.transaction(), "signIpfs").mockImplementation(() => {
				throw new Error();
			});

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			fireEvent.click(getByTestId("SendIPFSTransaction__button--submit"));

			await waitFor(() => expect(consoleSpy).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(passwordInput).toHaveValue(""));
			await waitFor(() =>
				expect(getByTestId("SendIPFSTransaction__step--third")).toHaveTextContent(
					transactionTranslations.INVALID_MNEMONIC,
				),
			);

			signMock.mockRestore();

			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});

	it("should show an error if an invalid IPFS hash is entered", async () => {
		const history = createMemoryHistory();
		const ipfsURL = `/profiles/${fixtureProfileId}/transactions/${wallet.id()}/ipfs`;

		history.push(ipfsURL);

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/ipfs">
				<SendIPFSTransaction />
			</Route>,
			{
				routes: [ipfsURL],
				history,
			},
		);

		await act(async () => {
			fireEvent.input(getByTestId("Input__hash"), {
				target: { value: "invalid-ipfs-hash" },
			});

			expect(getByTestId("Input__hash")).toHaveValue("invalid-ipfs-hash");

			await waitFor(() =>
				expect(getByTestId("SendIPFSTransaction__step--first")).toHaveTextContent(
					transactionTranslations.INPUT_IPFS_HASH.VALIDATION.NOT_VALID,
				),
			);

			await waitFor(() => expect(container).toMatchSnapshot());
		});
	});
});
