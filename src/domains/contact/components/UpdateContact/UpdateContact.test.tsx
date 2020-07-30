/* eslint-disable @typescript-eslint/require-await */
import { Contact, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, env, fireEvent, renderWithRouter, useDefaultNetMocks,waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { translations } from "../../i18n";
import { UpdateContact } from "./UpdateContact";

let profile: Profile;
let updatingContact: Contact;

describe("UpdateContact", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		updatingContact = profile.contacts().create("Test");
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<UpdateContact
				profileId={profile.id()}
				isOpen={false}
				networks={availableNetworksMock}
				contact={updatingContact}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<UpdateContact profileId={profile.id()} isOpen={true} contact={updatingContact} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_UPDATE_CONTACT.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should display contact info in form", () => {
		const { getByTestId } = renderWithRouter(
			<UpdateContact isOpen={true} profileId={profile.id()} contact={updatingContact} />,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());
	});

	it("should cancel contact update", async () => {
		const fn = jest.fn();
		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} onCancel={fn} profileId={profile.id()} contact={updatingContact} />
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
		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<UpdateContact isOpen={true} onDelete={onDelete} profileId={profile.id()} contact={updatingContact} />
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

		const contactToUpdate = {
			name: () => "Test",
			addresses: () => [],
			id: "",
		};

		contactToUpdate.id = updatingContact.id();

		const newName = "Updated name";
		const newAddress = {
			name: "Test Address",
			network: "devnet",
			address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			coin: "ARK",
		};

		const { getByTestId, queryByTestId } = renderWithRouter(
			<UpdateContact
				isOpen={true}
				onSave={onSaveAddress}
				profileId={profile.id()}
				contact={contactToUpdate}
				networks={availableNetworksMock}
			/>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(contactToUpdate.name());

		act(() => {
			fireEvent.change(nameInput, { target: { value: "Updated name" } });
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
			expect(onSaveAddress).toBeCalledWith(contactToUpdate.id);

			const savedContact = profile.contacts().findById(contactToUpdate.id);
			expect(savedContact.name()).toEqual(newName);

			const savedAddresses = savedContact.addresses().findByAddress(newAddress.address);
			expect(savedAddresses.length).toEqual(1);
			expect(savedAddresses[0]?.address()).toEqual(newAddress.address);
		});
	});
});
