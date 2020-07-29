import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Contact, Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { ContactListItem } from "./ContactListItem";

const singleOption = [{ label: "Option 1", value: "option_1" }];

const multiOptions = [...singleOption, { label: "Option 2", value: "option_2" }];

let contact: Contact;
let addressId: string;

describe("ContactListItem", () => {
	beforeAll(() => {
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
	});

	beforeAll(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		await env.bootFromObject(fixtureData);
		const profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");

		contact = profile.contacts().values()[0];
	});

	it("should render", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with one option", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} options={singleOption} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with multiple options", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} options={multiOptions} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onAction callback if provided with one option", () => {
		const onAction = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} onAction={onAction} options={singleOption} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		expect(onAction).toHaveBeenCalled();
	});

	it("should call onAction callback if provided with multiple options", () => {
		const onAction = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} onAction={onAction} options={multiOptions} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onAction).toHaveBeenCalled();
	});

	it("should not call onAction callback if not provided with multiple options", () => {
		const onAction = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} options={multiOptions} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onAction).not.toHaveBeenCalled();
	});

	it("should call onAction callback with given values", () => {
		const onAction = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} onAction={onAction} options={singleOption} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		expect(onAction).toHaveBeenCalledWith(singleOption[0], contact.addresses().values()[0].id());
	});
});
