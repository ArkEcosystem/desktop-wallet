/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	waitFor,
	within,
} from "utils/testing-library";

import { translations } from "../../i18n";
import { Contacts } from "./Contacts";

let profile: Profile;
let firstContactId: string;

let rendered: RenderResult;
const history = createMemoryHistory();

describe("Contacts", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "contact-form__cancel-btn"],
		["save", "contact-form__save-btn"],
	])("should open & close add contact modal (%s)", async (_, buttonId) => {
		const contactsURL = `/profiles/${profile.id()}/contacts`;
		history.push(contactsURL);

		const { getAllByTestId, getByTestId, queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts">
				<Contacts />
			</Route>,
			{
				routes: [contactsURL],
				history,
			},
		);

		fireEvent.click(getByTestId("contacts__add-contact-btn"));

		if (buttonId === "contact-form__save-btn") {
			expect(getByTestId("contact-form__save-btn")).toBeDisabled();
			expect(getByTestId("contact-form__add-address-btn")).toBeDisabled();

			const selectNetworkInput = getByTestId("SelectNetworkInput__input");

			expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

			await act(async () => {
				fireEvent.change(getByTestId("contact-form__address-input"), {
					target: { value: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD" },
				});

				fireEvent.change(getByTestId("contact-form__name-input"), {
					target: { value: "name" },
				});

				fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });
			});

			await act(async () => {
				fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
			});

			await waitFor(() => expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled());

			act(() => {
				fireEvent.click(getByTestId("contact-form__add-address-btn"));
			});

			await waitFor(() => expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1));
		}

		await waitFor(() => expect(queryByTestId(buttonId)).not.toBeDisabled());

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId(buttonId));
		});

		await waitFor(() => expect(queryByTestId("modal__inner")).toBeNull());

		// Check if contact is created
		if (buttonId === "contact-form__save-btn") {
			expect(profile.contacts().findByAddress("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD").length).toBe(1);
		}
	});

	describe("with contacts", () => {
		beforeEach(async () => {
			firstContactId = profile.contacts().values()[0].id();

			const contactsURL = `/profiles/${profile.id()}/contacts`;
			history.push(contactsURL);

			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/contacts">
					<Contacts />
				</Route>,
				{
					routes: [contactsURL],
					history,
				},
			);
		});

		it("should render with contacts", () => {
			const { asFragment, getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			expect(() => getByTestId("contacts__banner")).toThrow(/Unable to find an element by/);

			expect(asFragment()).toMatchSnapshot();
		});

		it("should open delete contact modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId(
				"dropdown__toggle",
			)[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			await waitFor(() => {
				expect(getByTestId("dropdown__options")).toBeTruthy();
			});

			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			await waitFor(() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			});
		});

		it("should close contact deletion modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId(
				"dropdown__toggle",
			)[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			await waitFor(() => {
				expect(getByTestId("dropdown__options")).toBeTruthy();
			});

			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			await waitFor(() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			});

			act(() => {
				fireEvent.click(getByTestId("modal__close-btn"));
			});

			await waitFor(() => {
				expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
			});
		});

		it("should cancel contact deletion modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId(
				"dropdown__toggle",
			)[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			await waitFor(() => {
				expect(getByTestId("dropdown__options")).toBeTruthy();
			});

			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			await waitFor(() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			});

			act(() => {
				fireEvent.click(getByTestId("DeleteResource__cancel-button"));
			});

			await waitFor(() => {
				expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
			});
		});

		it("should prompt for contact deletion from update modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId(
				"dropdown__toggle",
			)[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			await waitFor(() => {
				expect(getByTestId("dropdown__options")).toBeTruthy();
			});

			const editOption = getByTestId("dropdown__option--1");

			act(() => {
				fireEvent.click(editOption);
			});

			await waitFor(() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			});

			act(() => {
				fireEvent.click(getByTestId("contact-form__delete-btn"));
			});

			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.TITLE);
		});

		it("should delete contact from modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId(
				"dropdown__toggle",
			)[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			await waitFor(() => {
				expect(getByTestId("dropdown__options")).toBeTruthy();
			});

			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			await waitFor(() => {
				expect(getByTestId("modal__inner")).toBeTruthy();
			});

			act(() => {
				fireEvent.click(getByTestId("DeleteResource__submit-button"));
			});

			await waitFor(() => {
				expect(() => profile.contacts().findById(firstContactId)).toThrowError("Failed to find");
			});
		});
	});

	describe("without contacts", () => {
		beforeEach(async () => {
			profile.contacts().flush();

			const contactsURL = `/profiles/${profile.id()}/contacts`;
			history.push(contactsURL);

			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/contacts">
					<Contacts />
				</Route>,
				{
					routes: [contactsURL],
					history,
				},
			);
		});

		it("should render empty", () => {
			const { asFragment, getByTestId } = rendered;

			expect(() => getByTestId("ContactList")).toThrow(/Unable to find an element by/);

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			expect(getByTestId("contacts__banner")).toBeTruthy();

			expect(asFragment()).toMatchSnapshot();
		});
	});
});
