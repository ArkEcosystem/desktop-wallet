/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
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

let profile: Contracts.IProfile;

let rendered: RenderResult;
const history = createMemoryHistory();

const renderComponent = () => {
	const contactsURL = `/profiles/${profile.id()}/contacts`;
	history.push(contactsURL);

	return renderWithRouter(
		<Route path="/profiles/:profileId/contacts">
			<Contacts />
		</Route>,
		{
			routes: [contactsURL],
			history,
		},
	);
};

describe("Contacts", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render with contacts", () => {
		const { asFragment, getByTestId } = renderComponent();

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(getByTestId("ContactList")).toBeTruthy();
		expect(() => getByTestId("EmptyBlock")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without contacts", () => {
		const contactsSpy = jest.spyOn(profile.contacts(), "values").mockReturnValue([]);

		const { asFragment, getByTestId } = renderComponent();

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(() => getByTestId("ContactList")).toThrow(/Unable to find an element by/);
		expect(getByTestId("EmptyBlock")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();

		contactsSpy.mockRestore();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "contact-form__cancel-btn"],
	])("should open & %s add contact modal", async (_, buttonId) => {
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

		await waitFor(() => expect(queryByTestId(buttonId)).not.toBeDisabled());

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId(buttonId));
		});

		await waitFor(() => expect(queryByTestId("modal__inner")).toBeNull());
	});

	it("should successfully add contact", async () => {
		const { getAllByTestId, getByTestId, queryByTestId } = renderComponent();

		fireEvent.click(getByTestId("contacts__add-contact-btn"));

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

		await waitFor(() => expect(queryByTestId("contact-form__save-btn")).not.toBeDisabled());

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId("contact-form__save-btn"));
		});

		await waitFor(() => expect(queryByTestId("modal__inner")).toBeNull());

		expect(profile.contacts().findByAddress("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD").length).toBe(1);
	});

	it("should successfully delete contact", async () => {
		const newContact = profile.contacts().create("New Contact");
		await profile.contacts().update(newContact.id(), {
			addresses: [
				{
					network: "ark.devnet",
					address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
					name: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
					coin: "ARK",
				},
			],
		});

		const contactsSpy = jest
			.spyOn(profile.contacts(), "values")
			.mockReturnValue([profile.contacts().findById(newContact.id())]);

		const { getByTestId } = renderComponent();

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		await waitFor(() => {
			expect(getByTestId("ContactList")).toBeTruthy();
		});

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
		expect(firstContactOptionsDropdown).toBeTruthy();

		act(() => {
			fireEvent.click(firstContactOptionsDropdown);
		});

		await waitFor(() => {
			expect(getByTestId("dropdown__options")).toBeTruthy();
		});

		const deleteOption = within(getByTestId("dropdown__options")).getByText(commonTranslations.DELETE);

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
			expect(() => profile.contacts().findById(newContact.id())).toThrowError("Failed to find");
		});

		contactsSpy.mockRestore();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "DeleteResource__cancel-button"],
	])("should %s delete contact modal", async (_, buttonId) => {
		const { getByTestId } = renderComponent();

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		await waitFor(() => {
			expect(getByTestId("ContactList")).toBeTruthy();
		});

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
		expect(firstContactOptionsDropdown).toBeTruthy();

		act(() => {
			fireEvent.click(firstContactOptionsDropdown);
		});

		await waitFor(() => {
			expect(getByTestId("dropdown__options")).toBeTruthy();
		});

		const deleteOption = within(getByTestId("dropdown__options")).getByText(commonTranslations.DELETE);

		act(() => {
			fireEvent.click(deleteOption);
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		act(() => {
			fireEvent.click(getByTestId(buttonId));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});
	});

	it("should successfully delete contact from update modal", async () => {
		const newContact = profile.contacts().create("New Contact");
		await profile.contacts().update(newContact.id(), {
			addresses: [
				{
					network: "ark.devnet",
					address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
					name: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
					coin: "ARK",
				},
			],
		});

		const contactsSpy = jest
			.spyOn(profile.contacts(), "values")
			.mockReturnValue([profile.contacts().findById(newContact.id())]);

		const { getByTestId } = renderComponent();

		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		await waitFor(() => {
			expect(getByTestId("ContactList")).toBeTruthy();
		});

		const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
		expect(firstContactOptionsDropdown).toBeTruthy();

		act(() => {
			fireEvent.click(firstContactOptionsDropdown);
		});

		await waitFor(() => {
			expect(getByTestId("dropdown__options")).toBeTruthy();
		});

		const editOption = within(getByTestId("dropdown__options")).getByText(commonTranslations.EDIT);

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

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__submit-button"));
		});

		await waitFor(() => {
			expect(() => profile.contacts().findById(newContact.id())).toThrowError("Failed to find");
		});

		contactsSpy.mockRestore();
	});
});
