/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Contact, Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import { availableNetworksMock } from "domains/network/data";
import nock from "nock";
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { UpdateContact } from "./UpdateContact";

let env: Environment;
let profile: Profile;
let updatingContact: Contact;

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
			.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
			.persist();
	});

	beforeEach(async () => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		updatingContact = profile.contacts().values()[0];
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<UpdateContact
				profile={profile}
				isOpen={false}
				networks={availableNetworksMock}
				contact={updatingContact}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<UpdateContact profile={profile} isOpen={true} contact={updatingContact} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_UPDATE_CONTACT.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should display contact info in form", () => {
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} profile={profile} contact={updatingContact} />
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());
	});

	it("should cancel contact update", async () => {
		const fn = jest.fn();
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} onCancel={fn} profile={profile} contact={updatingContact} />
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());

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
				<UpdateContact isOpen={true} onDelete={onDelete} profile={profile} contact={updatingContact} />
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());

		act(() => {
			fireEvent.click(getByTestId("contact-form__delete-btn"));
		});

		await waitFor(() => {
			expect(onDelete).toBeCalled();
			expect(() => profile.contacts().findById(updatingContact.id())).toThrowError("Failed to find");
		});
	});

	it("should update contact name and address", async () => {
		const onSaveAddress = jest.fn();

		const newName = "Updated name";
		const newAddress = {
			name: "Test Address",
			network: "devnet",
			address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			coin: "ARK",
		};

		const { getByTestId, queryByTestId } = render(
			<EnvironmentProvider env={env}>
				<UpdateContact
					isOpen={true}
					onSave={onSaveAddress}
					profile={profile}
					contact={updatingContact}
					networks={availableNetworksMock}
				/>
			</EnvironmentProvider>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());

		act(() => {
			fireEvent.change(nameInput, { target: { value: newName } });
		});

		expect(nameInput).toHaveValue(newName);
		const saveButton = getByTestId("contact-form__save-btn");
		const assetInput = getByTestId("SelectNetworkInput__input");

		// Add network
		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: newAddress.address },
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
			expect(onSaveAddress).toBeCalledWith(updatingContact.id());

			const savedContact = profile.contacts().findById(updatingContact.id());
			expect(savedContact.name()).toEqual(newName);

			expect(savedContact.addresses().findByAddress(newAddress.address).length).toBeGreaterThan(0);
		});
	});
});
