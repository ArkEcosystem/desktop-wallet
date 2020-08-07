/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { TransactionService } from "@arkecosystem/platform-sdk-profiles/dist/wallets/wallet-transaction-service";
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
import transactionFixture from "tests/fixtures/coins/ark/transaction.json";

import { FifthStep, FirstStep, FourthStep, SecondStep, ThirdStep, TransactionSend } from "../TransactionSend";

const fixtureProfileId = getDefaultProfileId();

const onCopy = jest.fn();

let profile: Profile;
let wallet: Wallet;

describe("Transaction Send", () => {
	beforeAll(async () => {
		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		wallet = profile.wallets().values()[0];

		nock("https://dwallets.ark.io")
			.post("/api/transactions/search")
			.reply(200, require("tests/fixtures/coins/ark/transactions.json"))
			.get("/api/transactions/8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877")
			.reply(200, transactionFixture);
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep profile={profile} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: (0.1 * 1e8).toFixed(0),
					recipients: [
						{
							address: wallet.address(),
							amount: (1 * 1e8).toFixed(0),
						},
					],
					senderAddress: wallet.address(),
					smartbridge: "test smartbridge",
				},
			}),
		);

		const { asFragment, container, getByTestId } = render(
			<FormContext {...form.current}>
				<SecondStep profile={profile} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--second")).toBeTruthy();
		expect(container).toHaveTextContent(wallet.network().name);
		expect(container).toHaveTextContent("D8rr7B…s6YUYD");
		expect(container).toHaveTextContent("test smartbridge");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSend__step--fourth")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 5th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const transaction = (await wallet.transactions()).findById(
			"8f913b6b719e7767d49861c0aec79ced212767645cb793d75d2f1b89abb49877",
		);
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FifthStep transaction={transaction} />
			</FormContext>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate between steps", async () => {
		const history = createMemoryHistory();
		const transferURL = `/profiles/${fixtureProfileId}/transactions/transfer`;

		history.push(transferURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/transfer">
					<TransactionSend />
				</Route>,
				{
					routes: [transferURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId(`TransactionSend__step--first`)).toBeTruthy());
		});

		const { asFragment, getAllByTestId, getByTestId } = rendered!;

		// Step 1
		// Select network
		const networkIcons = getAllByTestId("SelectNetwork__NetworkIcon--container");
		await act(async () => fireEvent.click(networkIcons[1]));
		await waitFor(() => expect(getByTestId("NetworkIcon-ARK-devnet")).toHaveClass("border-theme-success-200"));
		// await waitFor(() => expect(form.getValues("network")).toBeTruthy());
		await waitFor(() =>
			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")).not.toHaveAttribute(
				"disabled",
			),
		);

		// Select sender & update fees
		await act(async () =>
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper")),
		);
		await waitFor(() => expect(() => expect(getByTestId("modal__inner")).toBeTruthy()));

		await act(async () => fireEvent.click(getByTestId("AddressListItem__select-0")));
		await waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));

		// await waitFor(() => expect(form.getValues("senderAddress")).toBeTruthy());
		await waitFor(() =>
			expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__input")).toHaveValue(
				profile.wallets().values()[0].address(),
			),
		);

		// await act(async () =>
		// 	rerender(
		// 		<Form context={form}>
		// 			<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
		// 		</Form>,
		// 	),
		// );

		// Select recipient
		await act(async () =>
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact")),
		);
		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		await act(async () => fireEvent.click(getAllByTestId("ContactListItem__one-option-button-0")[0]));
		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});

		expect(getByTestId("SelectRecipient__input")).toHaveValue(
			profile.contacts().values()[0].addresses().values()[0].address(),
		);

		// Amount
		await act(async () => fireEvent.click(getByTestId("add-recipient__send-all")));
		await waitFor(() => expect(getByTestId("add-recipient__amount-input")).toHaveValue(80));

		// Smartbridge
		await act(async () =>
			fireEvent.input(getByTestId("Input__smartbridge"), { target: { value: "test smartbridge" } }),
		);
		await waitFor(() => expect(getByTestId("Input__smartbridge")).toHaveValue("test smartbridge"));

		// Fee
		// await waitFor(() => expect(getByTestId("InputCurrency")).toHaveValue("0"));
		const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
		await act(async () => fireEvent.click(feeOptions[2]));
		// await waitFor(() => expect(getByTestId("InputCurrency")).not.toHaveValue("0"));

		fireEvent.click(getByTestId("TransactionSend__button--continue"));
		await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

		// Step 2

		fireEvent.click(getByTestId("TransactionSend__button--back"));
		await waitFor(() => expect(getByTestId("TransactionSend__step--first")).toBeTruthy());

		// Step 1

		fireEvent.click(getByTestId("TransactionSend__button--continue"));
		await waitFor(() => expect(getByTestId("TransactionSend__step--second")).toBeTruthy());

		// Step 2

		fireEvent.click(getByTestId("TransactionSend__button--continue"));
		await waitFor(() => expect(getByTestId("TransactionSend__step--third")).toBeTruthy());

		// Step 3

		const passwordInput = within(getByTestId("InputPassword")).getByTestId("Input");
		await act(async () => fireEvent.input(passwordInput, { target: { value: "passphrase" } }));
		await waitFor(() => expect(passwordInput).toHaveValue("passphrase"));

		// Step 5 (skip step 4 for now - ledger confirmation)

		// TransactionService.prototype.signTransfer
		const signMock = jest
			.spyOn(TransactionService.prototype, "signTransfer")
			.mockReturnValue(transactionFixture.data.id);
		const broadcastMock = jest.spyOn(TransactionService.prototype, "broadcast").mockImplementation();

		fireEvent.click(getByTestId("TransactionSend__button--submit"));
		await waitFor(() => expect(getByTestId("TransactionSend__step--fifth")).toBeTruthy());
		expect(container).toHaveTextContent(transactionFixture.data.id);

		// const copyMock = jest.fn();
		// const clipboardOriginal = navigator.clipboard;

		// // @ts-ignore
		// navigator.clipboard = { writeText: copyMock };

		// await fireEvent.click(getByTestId(`TransactionSend__button--copy`));
		// await waitFor(() => expect(copyMock).toHaveBeenCalledWith(JSON.stringify(signedMessage)));

		// // @ts-ignore
		// navigator.clipboard = clipboardOriginal;

		signMock.mcokRestore();
		broadcastMock.mcokRestore();

		await waitFor(() => expect(rendered.container).toMatchSnapshot());
		// expect(asFragment()).toMatchSnapshot();

		// await act(async () => {
		// 	// 1st step form
		// 	const submit1st = getByTestId("send-transaction-click-submit");
		// 	fireEvent.click(submit1st);

		// 	const continueButton = getByTestId(`TransactionSend__button--continue`);
		// 	expect(getByTestId(`TransactionSend__step--second`)).toBeTruthy();

		// 	fireEvent.click(continueButton);
		// 	expect(getByTestId(`TransactionSend__step--third`)).toBeTruthy();

		// 	fireEvent.click(continueButton);
		// 	expect(getByTestId(`TransactionSend__step--fourth`)).toBeTruthy();

		// 	// Back
		// 	fireEvent.click(getByTestId(`TransactionSend__button--back`));
		// 	expect(getByTestId(`TransactionSend__step--third`)).toBeTruthy();

		// 	fireEvent.click(continueButton);
		// 	fireEvent.click(continueButton);
		// 	await waitFor(() => expect(getByTestId(`TransactionSend__button--back-to-wallet`)).toBeTruthy());
		// });
	});
});
