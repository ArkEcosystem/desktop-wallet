import { Contact, Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { DeleteContact } from "./DeleteContact";

let contact: Contact;
let profile: Profile;

const onDelete = jest.fn();

describe("DeleteContact", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		contact = profile.contacts().values()[0];
	});

	afterEach(() => {
		onDelete.mockRestore();
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<DeleteContact isOpen={false} onDelete={onDelete} profile={profile} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<DeleteContact isOpen={true} onDelete={onDelete} profile={profile} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELETE_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete contact", async () => {
		const { getByTestId } = renderWithRouter(
			<DeleteContact isOpen={true} onDelete={onDelete} profile={profile} contact={contact} />,
		);
		const deleteBtn = getByTestId("DeleteResource__submit-button");

		act(() => {
			fireEvent.click(deleteBtn);
		});

		await waitFor(() => expect(onDelete).toBeCalled());
		expect(() => profile.contacts().findById(contact.id())).toThrowError("Failed to find");
	});
});
