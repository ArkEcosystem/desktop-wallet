/* eslint-disable @typescript-eslint/require-await */
import { Contact, Profile } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { CreateContact } from "./CreateContact";

const onSave = jest.fn();
let profile: Profile;
let existingContact: Contact;

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
		const { asFragment, getByTestId } = render(
			<CreateContact profile={profile} isOpen={true} onSave={onSave} networks={availableNetworksMock} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not create new contact if contact name exists", async () => {
		const fn = jest.fn();
		const { getByTestId, queryByTestId } = render(
			<CreateContact profile={profile} isOpen={true} onSave={onSave} networks={availableNetworksMock} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib" },
			});

			fireEvent.change(getByTestId("contact-form__name-input"), {
				target: { value: existingContact.name() },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });

			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => {
				expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
			});
		});

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__add-address-btn"));
		});

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__save-btn"));
		});

		await waitFor(() => {
			expect(fn).not.toHaveBeenCalled();
		});
	});
});
