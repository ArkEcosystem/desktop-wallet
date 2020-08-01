/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { availableNetworksMock as networks } from "domains/network/data";
import { wallets } from "domains/wallet/data";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, useDefaultNetMocks, waitFor, within } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { SendTransactionForm } from "./";

let profile: Profile;

describe("SendTransactionForm", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
	});

	it("should render", () => {
		const { container } = render(<SendTransactionForm wallets={wallets} profile={profile} networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should select sender and recipient", async () => {
		const { getByTestId, getAllByTestId } = render(
			<SendTransactionForm wallets={wallets} profile={profile} networks={networks} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		// Select sender
		act(() => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
		});
		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getByTestId("AddressListItem__select-0");

		act(() => {
			fireEvent.click(firstAddress);
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});

		const selectedAddressValue = profile.wallets().values()[0].address();

		expect(within(getByTestId("sender-address")).getByTestId("SelectAddress__input")).toHaveValue(
			selectedAddressValue,
		);

		// Select recipient
		act(() => {
			fireEvent.click(within(getByTestId("recipient-address")).getByTestId("SelectRecipient__select-contact"));
		});
		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const address = getAllByTestId("ContactListItem__one-option-button-0")[0];

		act(() => {
			fireEvent.click(address);
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});

		const selectedRecipientAddressValue = profile.contacts().values()[0].addresses().values()[0].address();

		expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedRecipientAddressValue);
	});

	it("should set available amount", async () => {
		const { getByTestId, container } = render(
			<SendTransactionForm wallets={wallets} profile={profile} maxAvailableAmount={100} />,
		);
		const sendAll = getByTestId("add-recipient__send-all");
		const amountInput = getByTestId("add-recipient__amount-input");

		await act(async () => {
			fireEvent.click(sendAll);
		});

		expect(amountInput).toHaveValue(100);
		expect(container).toMatchSnapshot();
	});

	it("should emit goBack button click", async () => {
		// Select network to enable buttons
		const fn = jest.fn();
		const { getByTestId } = render(<SendTransactionForm onBack={fn} profile={profile} networks={networks} />);
		const backBtn = getByTestId("send-transaction-click-back");

		await act(async () => {
			fireEvent.click(backBtn);
		});

		expect(fn).toBeCalled();
	});

	it("should submit form", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SendTransactionForm onSubmit={fn} profile={profile} networks={networks} />);
		const submit = getByTestId("send-transaction-click-submit");
		act(() => {
			fireEvent.click(submit);
		});

		await waitFor(() => {
			expect(fn).toBeCalled();
		});
	});
});
