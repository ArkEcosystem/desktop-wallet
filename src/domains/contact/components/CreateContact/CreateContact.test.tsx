/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { translations } from "../../i18n";
import { CreateContact } from "./CreateContact";

const onSave = jest.fn();

let profile: Contracts.IProfile;
let existingContact: Contracts.IContact;

describe("CreateContact", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		existingContact = profile.contacts().values()[0];
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<CreateContact profile={profile} isOpen={false} onSave={onSave} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render create contact modal", () => {
		const { asFragment, getByTestId } = render(<CreateContact profile={profile} isOpen={true} onSave={onSave} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not create new contact if contact name exists", async () => {
		const { getByTestId, queryByTestId } = render(
			<CreateContact profile={profile} isOpen={true} onSave={onSave} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		fireEvent.change(getByTestId("contact-form__name-input"), {
			target: { value: existingContact.name() },
		});

		const selectNetworkInput = getByTestId("SelectDropdownInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.change(getByTestId("contact-form__address-input"), {
			target: { value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib" },
		});

		await waitFor(() => {
			expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(getByTestId("contact-form__add-address-btn"));

		await waitFor(() => {
			expect(getByTestId("contact-form__save-btn")).toBeDisabled();
		});

		fireEvent.click(getByTestId("contact-form__save-btn"));

		await waitFor(() => {
			expect(onSave).not.toHaveBeenCalled();
		});
	});
});
