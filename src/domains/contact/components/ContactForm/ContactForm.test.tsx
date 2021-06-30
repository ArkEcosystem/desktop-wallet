/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { ContactForm } from "./ContactForm";

const onSave = jest.fn();
const onCancel = jest.fn();

let profile: Contracts.IProfile;
let contact: Contracts.IContact;
let validArkDevnetAddress: string;

describe("ContactForm", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		const [wallet] = profile.wallets().values();
		validArkDevnetAddress = wallet.address();
		contact = profile.contacts().values()[0];
	});

	it("should render", async () => {
		const { asFragment } = renderWithRouter(<ContactForm profile={profile} onCancel={onCancel} onSave={onSave} />);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__save-btn")).toBeDisabled();
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with errors", async () => {
		const { asFragment } = renderWithRouter(
			<ContactForm
				profile={profile}
				onCancel={onCancel}
				onSave={onSave}
				errors={{ name: "Contact name error" }}
			/>,
		);

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__save-btn")).toBeDisabled();
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle onChange event", async () => {
		const onChange = jest.fn();

		const name = "Sample name";

		renderWithRouter(
			<ContactForm
				profile={profile}
				onChange={onChange}
				onSave={onSave}
				errors={{ name: "Contact name error" }}
			/>,
		);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), { target: { value: name } });

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(name);
		});

		await waitFor(() => {
			expect(onChange).toHaveBeenCalled();
		});
	});

	it("should select cryptoasset", async () => {
		renderWithRouter(<ContactForm profile={profile} onCancel={onCancel} onSave={onSave} />);

		const selectNetworkInput = screen.getByTestId("SelectDropdown__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { code: 13, key: "Enter" });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});
	});

	it("should add a valid address successfully", async () => {
		renderWithRouter(<ContactForm profile={profile} onCancel={onCancel} onSave={onSave} />);

		expect(() => screen.getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), {
			target: { value: "name" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue("name");
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdown__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { code: 13, key: "Enter" });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.input(screen.getByTestId("contact-form__address-input"), {
			target: { value: validArkDevnetAddress },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue(validArkDevnetAddress);
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(screen.getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
		});
	});

	it("should not add invalid address and should display error message", async () => {
		renderWithRouter(<ContactForm profile={profile} onCancel={onCancel} onSave={onSave} />);

		expect(() => screen.getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), {
			target: { value: "name" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue("name");
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdown__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { code: 13, key: "Enter" });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.input(screen.getByTestId("contact-form__address-input"), {
			target: { value: "invalid address" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue("invalid address");
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(screen.getByTestId("Input__error")).toBeVisible();
		});

		expect(() => screen.getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);
	});

	it("should remove network from options", async () => {
		renderWithRouter(<ContactForm profile={profile} onCancel={onCancel} onSave={onSave} />);

		expect(() => screen.getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), {
			target: { value: "name" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue("name");
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdown__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK" } });
		fireEvent.keyDown(selectNetworkInput, { code: 13, key: "Enter" });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Mainnet");
		});

		fireEvent.input(screen.getByTestId("contact-form__address-input"), {
			target: { value: "AYuYnr7WwwLUc9rLpALwVFn85NFGGmsNK7" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue("AYuYnr7WwwLUc9rLpALwVFn85NFGGmsNK7");
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(screen.getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
		});

		// Second addition

		fireEvent.change(selectNetworkInput, { target: { value: "ARK" } });
		fireEvent.keyDown(selectNetworkInput, { code: 13, key: "Enter" });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});
	});

	it("should remove an address", async () => {
		renderWithRouter(<ContactForm profile={profile} contact={contact} onCancel={onCancel} onSave={onSave} />);

		expect(screen.getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().count());

		fireEvent.click(screen.getAllByTestId("contact-form__remove-address-btn")[0]);

		await waitFor(() => {
			expect(() => screen.getByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);
		});
	});

	it("should handle save", async () => {
		const onSave = jest.fn();

		renderWithRouter(<ContactForm profile={profile} onCancel={onCancel} onSave={onSave} />);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), {
			target: { value: "name" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue("name");
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdown__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { code: 13, key: "Enter" });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.input(screen.getByTestId("contact-form__address-input"), {
			target: { value: validArkDevnetAddress },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue(validArkDevnetAddress);
		});

		await waitFor(() => {
			expect(screen.queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(screen.getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__save-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__save-btn"));

		await waitFor(() => {
			expect(onSave).toHaveBeenCalled();
		});
	});
});
