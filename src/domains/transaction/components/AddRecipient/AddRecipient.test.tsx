/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { AddRecipient } from "./AddRecipient";

let profile: Profile;

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient Wallet",
		formatted: "Recipient Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient Multisig",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient in Ark",
	},
];

describe("AddRecipient", () => {
	beforeAll(async () => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
			.persist();

		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
	});

	it("should render", () => {
		const { container } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render without recipients", () => {
		const { container } = render(<AddRecipient profile={profile} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with multiple recipients tab", () => {
		const { container } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should select recipient", () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());

		const selectedAddressValue = profile.contacts().values()[0].addresses().values()[0].address();

		expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedAddressValue);
	});

	it("should set available amount", async () => {
		const { getByTestId, container } = render(
			<AddRecipient profile={profile} assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} />,
		);
		const sendAll = getByTestId("add-recipient__send-all");
		const amountInput = getByTestId("add-recipient__amount-input");
		await act(async () => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue(80);
		expect(container).toMatchSnapshot();
	});

	it("should toggle between single and multiple recipients", async () => {
		const { getByTestId } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				recipients={recipients}
			/>,
		);
		const singleButton = getByTestId("add-recipient-is-single-toggle");
		const multipleButton = getByTestId("add-recipient-is-multiple-toggle");

		await act(async () => {
			fireEvent.click(multipleButton);
		});
		expect(getByTestId("add-recipient__form-wrapper")).toHaveClass("MultiRecipientWrapper");

		await act(async () => {
			fireEvent.click(singleButton);
		});

		expect(getByTestId("add-recipient__form-wrapper")).not.toHaveClass("MultiRecipientWrapper");
	});

	it("should show add recipient button when recipient and amount are set in multipe tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		act(() => {
			fireEvent.click(getByTestId("add-recipient__send-all"));
		});

		waitFor(() => {
			const addedRecipientBtn = getByTestId("add-recipient__add-btn");
			expect(addedRecipientBtn).toBeTruthy();
		});
	});

	it("should add two recipients in multiple tab", async () => {
		const { getByTestId, getAllByTestId } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();
		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(firstAddress);
		});

		const addedRecipientBtn1 = getByTestId("add-recipient__add-btn");
		act(() => {
			fireEvent.click(addedRecipientBtn1);
		});

		// 2nd recipient

		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();
		const secondAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];
		act(() => {
			fireEvent.click(secondAddress);
		});

		waitFor(() => {
			const addedRecipients = getAllByTestId("recipient-list__recipient-list-item");
			expect(addedRecipients).toHaveLength(2);
		});
	});

	it("should add and remove recipient", async () => {
		const { getByTestId, getAllByTestId, queryByText } = render(
			<AddRecipient
				profile={profile}
				assetSymbol="ARK"
				maxAvailableAmount={80}
				availableAmount={0}
				isSingleRecipient={false}
			/>,
		);

		const sendAll = getByTestId("add-recipient__send-all");
		act(() => {
			fireEvent.click(sendAll);
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		waitFor(
			() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			},
			{ timeout: 2000 },
		);

		const firstAddress = getAllByTestId("ContactListItem__one-option-button-0")[0];
		act(() => {
			fireEvent.click(firstAddress);
		});

		act(() => {
			fireEvent.click(getByTestId("add-recipient__add-btn"));
		});

		const removeBtn = getAllByTestId("recipient-list__remove-recipient");
		expect(removeBtn[0]).toBeTruthy();
		act(() => {
			fireEvent.click(removeBtn[0]);
		});

		const addedRecipient = queryByText("Recipient wallet");
		expect(addedRecipient).toBeFalsy();
	});
});
