/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { act, fireEvent, render, waitFor } from "testing-library";

import { contacts } from "../../data";
import { translations } from "../../i18n";
import { Contacts } from "./Contacts";

const assets = [
	{
		icon: "Ark",
		name: "Ark Ecosystem",
		className: "text-theme-danger-400 border-theme-danger-200",
	},
	{
		icon: "Bitcoin",
		name: "Bitcoin",
		className: "text-theme-warning-400 border-theme-warning-200",
	},
	{
		icon: "Ethereum",
		name: "Ethereum",
		className: "text-theme-neutral-800 border-theme-neutral-600",
	},
];

describe("Contacts", () => {
	const history = createMemoryHistory();

	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<Contacts contacts={[]} />
			</Router>,
		);

		expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(getByTestId("contacts__banner")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with contacts", () => {
		const { asFragment, getByTestId } = render(
			<Router history={history}>
				<Contacts contacts={contacts} />
			</Router>,
		);

		expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("contacts")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(() => getByTestId("contacts__banner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "contact-form__cancel-btn"],
		["save", "contact-form__save-btn"],
	])("should open & close add contact modal (%s)", async (buttonName, buttonId) => {
		const { getAllByTestId, getByTestId, queryByTestId } = render(
			<Router history={history}>
				<Contacts contacts={[]} assets={assets} />
			</Router>,
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
