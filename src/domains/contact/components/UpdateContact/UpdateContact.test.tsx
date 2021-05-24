/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { UpdateContact } from "./UpdateContact";

let profile: Contracts.IProfile;
let contact: Contracts.IContact;

describe("UpdateContact", () => {
	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		contact = profile.contacts().values()[0];
	});

	it("should not render if not open", () => {
		const { asFragment } = renderWithRouter(<UpdateContact profile={profile} isOpen={false} contact={contact} />);

		expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", async () => {
		const { asFragment } = renderWithRouter(<UpdateContact isOpen={true} profile={profile} contact={contact} />);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(contact.name());
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should cancel contact update", async () => {
		const onCancel = jest.fn();

		renderWithRouter(<UpdateContact isOpen={true} onCancel={onCancel} profile={profile} contact={contact} />);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(contact.name());
		});

		fireEvent.click(screen.getByTestId("contact-form__cancel-btn"));

		expect(onCancel).toHaveBeenCalled();
	});

	it("should not update contact if provided name already exists", async () => {
		const onSave = jest.fn();

		const newAddress = {
			name: "Test name",
			network: "ark.devnet",
			address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			coin: "ARK",
		};

		const newContact = profile.contacts().create("New name");

		renderWithRouter(<UpdateContact isOpen={true} onSave={onSave} profile={profile} contact={newContact} />);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(newContact.name());
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "DARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("DARK Devnet");
		});

		fireEvent.change(screen.getByTestId("contact-form__address-input"), {
			target: { value: newAddress.address },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue(newAddress.address);
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		fireEvent.input(screen.getByTestId("contact-form__name-input"), { target: { value: contact.name() } });

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(contact.name());
		});

		expect(screen.getByTestId("Input__error")).toBeVisible();

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__save-btn")).toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__save-btn"));

		expect(onSave).not.toHaveBeenCalled();
	});

	it("should call onDelete callback", async () => {
		const deleteSpy = jest.spyOn(profile.contacts(), "forget").mockImplementation();

		const onDelete = jest.fn();

		renderWithRouter(<UpdateContact isOpen={true} onDelete={onDelete} profile={profile} contact={contact} />);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(contact.name());
		});

		fireEvent.click(screen.getByTestId("contact-form__delete-btn"));

		await waitFor(() => {
			expect(onDelete).toBeCalled();
		});

		deleteSpy.mockRestore();
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

		renderWithRouter(<UpdateContact isOpen={true} onSave={onSave} profile={profile} contact={contact} />);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(contact.name());
		});

		fireEvent.click(screen.getAllByTestId("contact-form__remove-address-btn")[0]);

		await waitFor(() => {
			expect(() => screen.getByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);
		});

		fireEvent.input(screen.getByTestId("contact-form__name-input"), { target: { value: newName } });

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(newName);
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "DARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("DARK Devnet");
		});

		fireEvent.input(screen.getByTestId("contact-form__address-input"), {
			target: { value: newAddress.address },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue(newAddress.address);
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__save-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__save-btn"));

		await waitFor(() => {
			expect(onSave).toBeCalledWith(contact.id());
		});

		const savedContact = profile.contacts().findById(contact.id());

		expect(savedContact.name()).toEqual(newName);
		expect(savedContact.addresses().findByAddress(newAddress.address).length).toBeGreaterThan(0);
	});
});
