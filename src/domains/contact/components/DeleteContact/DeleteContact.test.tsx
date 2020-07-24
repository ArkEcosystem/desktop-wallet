import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Contact, Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { contacts } from "domains/contact/data";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import { profiles } from "tests/fixtures/env/data.json";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { DeleteContact } from "./DeleteContact";

let env: Environment;
let contact: Contact;
let profile: Profile;

const onDelete = jest.fn();

describe("DeleteContact", () => {
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
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallet.json"))
			.persist();
	});

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		await env.bootFromObject({ data: {}, profiles });
		profile = env.profiles().findById("bob");

		const firstContact = contacts[0];
		contact = profile.contacts().create(firstContact.name());
		profile.contacts().update(contact.id(), { addresses: firstContact.addresses() });
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<EnvironmentProvider env={env}>
				<DeleteContact isOpen={false} onDelete={onDelete} profileId="1" />
			</EnvironmentProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<EnvironmentProvider env={env}>
				<DeleteContact isOpen={true} onDelete={onDelete} profileId="1" />
			</EnvironmentProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete contact", async () => {
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<DeleteContact isOpen={true} onDelete={onDelete} profileId={profile.id()} contactId={contact.id()} />
			</EnvironmentProvider>,
		);
		const deleteBtn = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteBtn);
		});

		await waitFor(() => expect(onDelete).toBeCalled());
		expect(() => profile.contacts().findById(contact.id())).toThrowError("Failed to find");
	});

	it("should not emit onDelete if contactId is not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<DeleteContact isOpen={true} onDelete={fn} profileId={profile.id()} />
			</EnvironmentProvider>,
		);
		const deleteBtn = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteBtn);
		});

		expect(fn).not.toBeCalled();
	});
});
