import { Contact, Profile } from "@arkecosystem/platform-sdk-profiles";
import { contacts } from "domains/contact/data";
import React from "react";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	useDefaultNetMocks,
	waitFor,
} from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { translations } from "../../i18n";
import { DeleteContact } from "./DeleteContact";

let contact: Contact;
let profile: Profile;

const onDelete = jest.fn();

describe("DeleteContact", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();

		profile = env.profiles().findById(getDefaultProfileId());

		const firstContact = contacts[0];
		contact = profile.contacts().create(firstContact.name());
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<DeleteContact isOpen={false} onDelete={onDelete} profileId="1" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<DeleteContact isOpen={true} onDelete={onDelete} profileId="1" />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete contact", async () => {
		const { getByTestId } = renderWithRouter(
			<DeleteContact isOpen={true} onDelete={onDelete} profileId={profile.id()} contactId={contact.id()} />,
		);
		const deleteBtn = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteBtn);
		});

		await waitFor(() => expect(onDelete).toBeCalled());
		expect(() => profile.contacts().findById(contact.id())).toThrowError("Failed to find");
	});

	it("should not emit onDelete if contactId is not provided", () => {
		const fn = jest.fn();
		const { getByTestId } = renderWithRouter(
			<DeleteContact isOpen={true} onDelete={fn} profileId={profile.id()} />,
		);
		const deleteBtn = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteBtn);
		});

		expect(fn).not.toBeCalled();
	});
});
