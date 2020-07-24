/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Contact, Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import { profiles } from "tests/fixtures/env/data.json";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { UpdateContact } from "./UpdateContact";

let env: Environment;
let contact: Contact;
let profile: Profile;
const contactToEdit = {
	name: () => "Test",
	id: "",
	addresses: () => [],
};

describe("UpdateContact", () => {
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

		contact = profile.contacts().create("Test name");
		contactToEdit.id = contact.id();
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<UpdateContact isOpen={false} networks={availableNetworksMock} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<UpdateContact isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_UPDATE_CONTACT.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should display contact info in form", () => {
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} profileId={profile.id()} contact={contact} />
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(contact.name());
	});

	it("should cancel contact update", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} onCancel={fn} profileId={profile.id()} contact={contact} />
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(contact.name());

		act(() => {
			fireEvent.click(getByTestId("contact-form__cancel-btn"));
		});

		await waitFor(() => {
			expect(fn).toBeCalled();
		});
	});

	it("should delete contact", async () => {
		const onDelete = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} onDelete={onDelete} profileId={profile.id()} contact={contact} />
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(contact.name());

		act(() => {
			fireEvent.click(getByTestId("contact-form__delete-btn"));
		});

		await waitFor(() => {
			expect(onDelete).toBeCalled();
			expect(() => profile.contacts().findById(contact.id())).toThrowError("Failed to find");
		});
	});

	it("should update contact name", async () => {
		const fn = jest.fn();
		const { getByTestId, queryByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact
					isOpen={true}
					onSave={fn}
					profileId={profile.id()}
					contact={contactToEdit}
					networks={availableNetworksMock}
				/>
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(contactToEdit.name());

		act(() => {
			fireEvent.change(nameInput, { target: { value: "Updated name" } });
		});

		expect(nameInput).toHaveValue("Updated name");
		const saveButton = getByTestId("contact-form__save-btn");
		const assetInput = getByTestId("SelectNetworkInput__input");

		// Add network
		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: "address" },
			});

			fireEvent.change(assetInput, { target: { value: "Ark Devnet" } });
			fireEvent.keyDown(assetInput, { key: "Enter", code: 13 });
		});

		await waitFor(() => {
			expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});
		await act(async () => {
			fireEvent.click(getByTestId("contact-form__add-address-btn"));
		});

		expect(saveButton).not.toBeDisabled();

		await act(async () => {
			fireEvent.click(saveButton);
		});

		await waitFor(() => {
			expect(fn).toBeCalled();

			const savedContact = profile.contacts().findById(contactToEdit.id);
			expect(savedContact.name()).toEqual("Updated name");
		});
	});
});
