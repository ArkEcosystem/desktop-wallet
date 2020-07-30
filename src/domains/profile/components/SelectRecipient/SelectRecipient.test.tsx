/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { SelectRecipient } from "./SelectRecipient";

let profile: Profile;

describe("SelectRecipient", () => {
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

	it("should render empty", () => {
		const { container } = render(<SelectRecipient profile={profile} />);
		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<SelectRecipient profile={profile} disabled />);
		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container } = render(<SelectRecipient profile={profile} isInvalid />);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected address", () => {
		const { container } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should open and close contacts modal", () => {
		const { getByTestId } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		waitFor(() => expect(getByTestId("modal__inner")).toBeFalsy());
	});

	it("should select address from contacts modal", () => {
		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
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

		waitFor(() => {
			expect(getByTestId("modal__inner").toThrow(/Unable to find an element by/));

			const selectedAddressValue = contacts[0]?.addresses()[0]?.address;
			expect(getByTestId("SelectRecipient__input")).toHaveValue(selectedAddressValue);
		});
	});

	it("should not open contacts modal if disabled", () => {
		const { getByTestId } = render(
			<SelectRecipient profile={profile} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" disabled />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectRecipient__select-contact"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should call onChange prop when entered address in input", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SelectRecipient profile={profile} onChange={fn} />);
		const address = "bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT";
		const recipientInputField = getByTestId("SelectRecipient__input");

		await act(async () => {
			fireEvent.change(recipientInputField, { target: { value: address } });
		});

		expect(fn).toBeCalledWith(address);
	});

	it("should call onChange prop if provided", async () => {
		const fn = jest.fn();

		const { getByTestId, getAllByTestId } = render(
			<SelectRecipient profile={profile} onChange={fn} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		await act(async () => {
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
		expect(fn).toBeCalledWith(selectedAddressValue);
	});
});
