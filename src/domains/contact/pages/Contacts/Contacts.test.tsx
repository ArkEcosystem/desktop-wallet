/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, renderWithRouter, waitFor } from "testing-library";

import { contacts, networks } from "../../data";
import { translations } from "../../i18n";
import { Contacts } from "./Contacts";

describe("Contacts", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(<Contacts contacts={[]} />);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(getByTestId("contacts__banner")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with contacts", () => {
		const { asFragment, getByTestId } = renderWithRouter(<Contacts contacts={contacts} />);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(() => getByTestId("contacts__banner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "contact-form__cancel-btn"],
		["save", "contact-form__save-btn"],
	])("should open & close add contact modal (%s)", async (buttonName, buttonId) => {
		const { getAllByTestId, getByTestId, queryByTestId } = renderWithRouter(
			<Contacts contacts={[]} networks={networks} />,
		);

		fireEvent.click(getByTestId("contacts__add-contact-btn"));

		if (buttonId === "contact-form__save-btn") {
			expect(getByTestId("contact-form__save-btn")).toBeDisabled();
			expect(getByTestId("contact-form__add-address-btn")).toBeDisabled();

			const assetInput = getByTestId("select-asset__input");

			expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

			await act(async () => {
				await fireEvent.change(getByTestId("contact-form__address-input"), {
					target: { value: "address" },
				});

				fireEvent.change(getByTestId("contact-form__name-input"), {
					target: { value: "name" },
				});

				fireEvent.change(assetInput, { target: { value: "Bitco" } });

				fireEvent.keyDown(assetInput, { key: "Enter", code: 13 });

				await waitFor(() => {
					expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
				});

				fireEvent.click(getByTestId("contact-form__add-address-btn"));

				await waitFor(() => {
					expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
				});
			});
		}

		await waitFor(() => {
			expect(queryByTestId(buttonId)).not.toBeDisabled();
		});

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		await act(async () => {
			fireEvent.click(getByTestId(buttonId));
		});

		expect(queryByTestId("modal__inner")).not.toBeInTheDocument();
	});
});
