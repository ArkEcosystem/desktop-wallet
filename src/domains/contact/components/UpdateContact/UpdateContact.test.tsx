/* eslint-disable @typescript-eslint/require-await */
import { Contact, Profile } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { UpdateContact } from "./UpdateContact";

let profile: Profile;
let updatingContact: Contact;

describe("UpdateContact", () => {
	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		updatingContact = profile.contacts().values()[0];
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
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
		const { asFragment, getByTestId } = renderWithRouter(
			<UpdateContact profile={profile} isOpen={true} contact={updatingContact} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should display contact info in form", () => {
		const { getByTestId } = renderWithRouter(
			<UpdateContact isOpen={true} profile={profile} contact={updatingContact} />,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());
	});

	it("should cancel contact update", async () => {
		const onCancel = jest.fn();
		const { getByTestId } = renderWithRouter(
			<UpdateContact isOpen={true} onCancel={onCancel} profile={profile} contact={updatingContact} />,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());

		act(() => {
			fireEvent.click(getByTestId("contact-form__cancel-btn"));
		});

		await waitFor(() => {
			expect(onCancel).toBeCalled();
		});
	});

	it("should not update contact if provided name already exists", async () => {
		const onSave = jest.fn();

		const existingContactName = updatingContact.name();

		const newAddress = {
			name: "Test name",
			network: "ark.devnet",
			address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			coin: "ARK",
		};

		const newContact = profile.contacts().create("New name");

		const { getByTestId, queryByTestId } = renderWithRouter(
			<UpdateContact
				isOpen={true}
				onSave={onSave}
				profile={profile}
				contact={newContact}
				networks={availableNetworksMock}
			/>,
		);

		const saveButton = getByTestId("contact-form__save-btn");
		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: newAddress.address },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		await waitFor(() => {
			expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__add-address-btn"));
		});

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(newContact.name());

		await act(async () => {
			fireEvent.change(nameInput, { target: { value: existingContactName } });
		});

		expect(nameInput).toHaveValue(existingContactName);

		await act(async () => {
			fireEvent.click(saveButton);
		});

		expect(onSave).not.toHaveBeenCalled();
	});

	it("should call onDelete callback", async () => {
		const contactToDelete = profile.contacts().create("Test");

		const onDelete = jest.fn();
		const { getByTestId } = renderWithRouter(
			<UpdateContact isOpen={true} onDelete={onDelete} profile={profile} contact={contactToDelete} />,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(contactToDelete.name());

		act(() => {
			fireEvent.click(getByTestId("contact-form__delete-btn"));
		});

		await waitFor(() => {
			expect(onDelete).toBeCalled();
		});
	});

	it("should update contact name and address", async () => {
		const onSave = jest.fn();

		const newName = "Updated name";
		const newAddress = {
			name: "Test Address",
			network: "ark.devnet",
			address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			coin: "ARK",
		};

		const { getByTestId, queryByTestId } = renderWithRouter(
			<UpdateContact
				isOpen={true}
				onSave={onSave}
				profile={profile}
				contact={updatingContact}
				networks={availableNetworksMock}
			/>,
		);

		const nameInput = getByTestId("contact-form__name-input");
		expect(nameInput).toHaveValue(updatingContact.name());

		act(() => {
			fireEvent.change(nameInput, { target: { value: newName } });
		});

		expect(nameInput).toHaveValue(newName);
		const saveButton = getByTestId("contact-form__save-btn");
		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: newAddress.address },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
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
			expect(onSave).toBeCalledWith(updatingContact.id());

			const savedContact = profile.contacts().findById(updatingContact.id());
			expect(savedContact.name()).toEqual(newName);

			expect(savedContact.addresses().findByAddress(newAddress.address).length).toBeGreaterThan(0);
		});
	});
});
