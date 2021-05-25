/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	screen,
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
		const { asFragment } = renderComponent();

		expect(screen.getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(screen.getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(screen.getByTestId("ContactList")).toBeTruthy();
		expect(() => screen.getByTestId("EmptyBlock")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without contacts", () => {
		const contactsSpy = jest.spyOn(profile.contacts(), "values").mockReturnValue([]);

		const { asFragment } = renderComponent();

		expect(screen.getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
		expect(screen.getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

		expect(() => screen.getByTestId("ContactList")).toThrow(/Unable to find an element by/);
		expect(screen.getByTestId("EmptyBlock")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();

		contactsSpy.mockRestore();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "contact-form__cancel-btn"],
	])("should open & %s add contact modal", async (_, buttonId) => {
		renderComponent();

		fireEvent.click(screen.getByTestId("contacts__add-contact-btn"));

		await waitFor(() => expect(screen.getByTestId(buttonId)).not.toBeDisabled());

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

		fireEvent.click(screen.getByTestId(buttonId));

		expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should successfully add contact", async () => {
		renderComponent();

		fireEvent.click(screen.getByTestId("contacts__add-contact-btn"));

		expect(screen.getByTestId("contact-form__save-btn")).toBeDisabled();
		expect(screen.getByTestId("contact-form__add-address-btn")).toBeDisabled();

		expect(() => screen.getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		fireEvent.input(screen.getByTestId("contact-form__name-input"), {
			target: { value: "Test Contact" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__name-input")).toHaveValue("Test Contact");
		});

		const selectNetworkInput = screen.getByTestId("SelectDropdownInput__input");

		fireEvent.change(selectNetworkInput, { target: { value: "DARK D" } });
		fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

		await waitFor(() => {
			expect(selectNetworkInput).toHaveValue("ARK Devnet");
		});

		fireEvent.input(screen.getByTestId("contact-form__address-input"), {
			target: { value: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD" },
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__address-input")).toHaveValue("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
		});

		await waitFor(() => {
			expect(screen.getByTestId("contact-form__add-address-btn")).not.toBeDisabled();
		});

		fireEvent.click(screen.getByTestId("contact-form__add-address-btn"));

		await waitFor(() => expect(screen.getAllByTestId("contact-form__address-list-item")).toHaveLength(1));

		await waitFor(() => expect(screen.getByTestId("contact-form__save-btn")).not.toBeDisabled());

		fireEvent.click(screen.getByTestId("contact-form__save-btn"));

		await waitFor(() => {
			expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});

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

		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("ContactList")).toBeTruthy();
		});

		const firstContactOptionsDropdown = within(screen.getByTestId("ContactList")).getAllByTestId(
			"dropdown__toggle",
		)[0];
		fireEvent.click(firstContactOptionsDropdown);

		await waitFor(() => {
			expect(screen.getByTestId("dropdown__options")).toBeTruthy();
		});

		const deleteOption = within(screen.getByTestId("dropdown__options")).getByText(commonTranslations.DELETE);
		fireEvent.click(deleteOption);

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toBeTruthy();
		});

		fireEvent.click(screen.getByTestId("DeleteResource__submit-button"));

		await waitFor(() => {
			expect(() => profile.contacts().findById(newContact.id())).toThrowError("Failed to find");
		});

		contactsSpy.mockRestore();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "DeleteResource__cancel-button"],
	])("should %s delete contact modal", async (_, buttonId) => {
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("ContactList")).toBeTruthy();
		});

		const firstContactOptionsDropdown = within(screen.getByTestId("ContactList")).getAllByTestId(
			"dropdown__toggle",
		)[0];
		fireEvent.click(firstContactOptionsDropdown);

		await waitFor(() => {
			expect(screen.getByTestId("dropdown__options")).toBeTruthy();
		});

		const deleteOption = within(screen.getByTestId("dropdown__options")).getByText(commonTranslations.DELETE);
		fireEvent.click(deleteOption);

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toBeTruthy();
		});

		fireEvent.click(screen.getByTestId(buttonId));

		await waitFor(() => {
			expect(() => screen.getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
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

		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("ContactList")).toBeTruthy();
		});

		const firstContactOptionsDropdown = within(screen.getByTestId("ContactList")).getAllByTestId(
			"dropdown__toggle",
		)[0];
		fireEvent.click(firstContactOptionsDropdown);

		await waitFor(() => {
			expect(screen.getByTestId("dropdown__options")).toBeTruthy();
		});

		const editOption = within(screen.getByTestId("dropdown__options")).getByText(commonTranslations.EDIT);
		fireEvent.click(editOption);

		await waitFor(() => {
			expect(screen.getByTestId("modal__inner")).toBeTruthy();
		});

		fireEvent.click(screen.getByTestId("contact-form__delete-btn"));

		expect(screen.getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.TITLE);
		fireEvent.click(screen.getByTestId("DeleteResource__submit-button"));

		await waitFor(() => {
			expect(() => profile.contacts().findById(newContact.id())).toThrowError("Failed to find");
		});

		contactsSpy.mockRestore();
	});

	it("should redirect contact address to send transfer page", async () => {
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

		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("ContactList")).toBeTruthy();
		});

		fireEvent.click(screen.getAllByTestId("ContactListItem__send-button")[0]);

		expect(history.location.pathname).toEqual("/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/send-transfer");
		expect(history.location.search).toEqual(
			"?coin=ARK&network=ark.devnet&recipient=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		);

		contactsSpy.mockRestore();
	});

	it("should search for contact", async () => {
		const [contact1, contact2] = profile.contacts().values();

		renderComponent();

		expect(screen.getAllByTestId("ContactListItem__name")).toHaveLength(profile.contacts().count());
		expect(screen.getByText(contact1.name())).toBeInTheDocument();
		expect(screen.getByText(contact2.name())).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("header-search-bar__button"));

		await waitFor(() =>
			expect(within(screen.getByTestId("header-search-bar__input")).getByTestId("Input")).toBeTruthy(),
		);

		fireEvent.input(within(screen.getByTestId("header-search-bar__input")).getByTestId("Input"), {
			target: { value: contact1.name() },
		});

		await waitFor(() => expect(screen.getAllByTestId("ContactListItem__name")).toHaveLength(1));

		expect(screen.queryByText(contact2.name())).not.toBeInTheDocument();

		fireEvent.input(within(screen.getByTestId("header-search-bar__input")).getByTestId("Input"), {
			target: { value: "Unknown Name" },
		});

		await waitFor(() => expect(screen.queryByTestId("Contacts--empty-results")).toBeInTheDocument());
	});
});
