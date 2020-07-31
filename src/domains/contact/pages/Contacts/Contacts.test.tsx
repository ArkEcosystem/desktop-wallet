/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor, within } from "utils/testing-library";

import { contacts } from "../../data";
import { translations } from "../../i18n";
import { Contacts } from "./Contacts";

let profile: Profile;
let firstContactId: string;

describe("Contacts", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		// Add all used contacts in page to profile,
		// to retrieve id and perform deletion tests.
		contacts.forEach((contact: any, index: number) => {
			const addedContact = profile.contacts().create(contact.name());
			contact.id = addedContact.id();
			if (index === 0) {
				firstContactId = contact.id;
			}
		});
	});

	it("should render empty", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);
		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(getByTestId("contacts__banner")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with contacts", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={contacts} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(() => getByTestId("contacts__banner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "contact-form__cancel-btn"],
		["save", "contact-form__save-btn"],
	])("should open & close add contact modal (%s)", async (_, buttonId) => {
		const { getAllByTestId, getByTestId, queryByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={[]} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		fireEvent.click(getByTestId("contacts__add-contact-btn"));

		if (buttonId === "contact-form__save-btn") {
			expect(getByTestId("contact-form__save-btn")).toBeDisabled();
			expect(getByTestId("contact-form__add-address-btn")).toBeDisabled();

			const assetInput = getByTestId("SelectNetworkInput__input");

			expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

			await act(async () => {
				fireEvent.change(getByTestId("contact-form__address-input"), {
					target: { value: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD" },
				});

				fireEvent.change(getByTestId("contact-form__name-input"), {
					target: { value: "name" },
				});

				fireEvent.change(assetInput, { target: { value: "Ark Devnet" } });
			});

			await act(async () => {
				fireEvent.keyDown(assetInput, { key: "Enter", code: 13 });
			});

			expect(assetInput).toHaveValue("Ark Devnet");

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

	it("should open delete contact modal", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={contacts} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
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
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={contacts} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
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
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={contacts} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
		expect(firstContactOptionsDropdown).toBeTruthy();

		act(() => {
			fireEvent.click(firstContactOptionsDropdown);
		});

		expect(getByTestId("dropdown__options")).toBeTruthy();
		const deleteOption = getByTestId("dropdown__option--2");

		act(() => {
			fireEvent.click(deleteOption);
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__cancel-button"));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});
	});

	it("ignore random contact item action", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={contacts} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
		expect(firstContactOptionsDropdown).toBeTruthy();

		act(() => {
			fireEvent.click(firstContactOptionsDropdown);
		});

		await waitFor(() => {
			expect(getByTestId("dropdown__options")).toBeTruthy();
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--1"));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});
	});

	it("should delete contact from modal", async () => {
		const { getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/contacts/">
				<Contacts contacts={contacts} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/contacts`],
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
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
