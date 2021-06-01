/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { translations } from "../../i18n";
import { CreateContact } from "./CreateContact";

const onSave = jest.fn();

let profile: Contracts.IProfile;
let contact: Contracts.IContact;

describe("CreateContact", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		contact = profile.contacts().values()[0];
	});

	it("should not render if not open", () => {
		const { asFragment } = render(<CreateContact profile={profile} isOpen={false} onSave={onSave} />);

		expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", () => {
		const { asFragment } = render(<CreateContact profile={profile} isOpen={true} onSave={onSave} />);

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not create new contact if contact name exists", async () => {
		render(<CreateContact profile={profile} isOpen={true} onSave={onSave} />);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), {
			target: { value: contact.name() },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue(contact.name());
		});

		expect(screen.getByTestId("Input__error")).toBeVisible();

		const selectNetworkInput = screen.getByTestId("SelectDropdown__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.change(screen.getByTestId("contact-form__address-input"), {
			target: { value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__save-btn")).toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__save-btn"));

		expect(onSave).not.toHaveBeenCalled();
	});
});
