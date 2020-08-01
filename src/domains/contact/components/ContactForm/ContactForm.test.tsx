/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Contact, Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { availableNetworksMock as networks } from "domains/network/data";
import React from "react";
import { act, fireEvent, render, useDefaultNetMocks, waitFor } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { ContactForm } from "./ContactForm";

const onDelete = jest.fn();
const onSave = jest.fn();
const onCancel = jest.fn();

let contact: Contact;

describe("ContactForm", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		contact = env.profiles().values()[0].contacts().values()[0];
	});

	it("should select network", () => {
		const { getByTestId } = render(<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />);

		const input = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(input).toHaveValue("Bitcoin");
	});

	it("should add an address", async () => {
		const { getAllByTestId, getByTestId, queryByTestId } = render(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		const assetInput = getByTestId("SelectNetworkInput__input");

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
		});

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__add-address-btn"));
		});

		expect(() => getAllByTestId("contact-form__address-list-item").toHaveLength(1));
	});

	it("should remove an address", async () => {
		let renderContext;

		await act(async () => {
			renderContext = render(
				<ContactForm contact={contact} networks={networks} onCancel={onCancel} onSave={onSave} />,
			);
		});

		const { getByTestId, getAllByTestId } = renderContext;

		expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().count());

		await act(async () => {
			fireEvent.click(getAllByTestId("contact-form__remove-address-btn")[0]);
		});

		await waitFor(() => {
			expect(() => getByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);
		});
	});

	it("should handle save", async () => {
		let renderContext;

		await act(async () => {
			renderContext = render(
				<ContactForm contact={contact} networks={networks} onCancel={onCancel} onSave={onSave} />,
			);
		});

		await act(async () => {
			fireEvent.click(renderContext.getByTestId("contact-form__save-btn"));
		});

		expect(onSave).toHaveBeenCalled();
	});

	describe("when creating a new contact", () => {
		it("should render the form", () => {
			const { asFragment, getAllByTestId, getByTestId } = render(
				<ContactForm onCancel={onCancel} onSave={onSave} />,
			);

			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NAME);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NETWORK);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.ADDRESS);
			expect(getByTestId("contact-form__save-btn")).toBeTruthy();
			expect(() => getAllByTestId("contact-form__address-list")).toThrow(/Unable to find an element by/);
			expect(() => getAllByTestId("contact-form__delete-btn")).toThrow(/Unable to find an element by/);
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe("when editing an existing contact", () => {
		it("should render the form", async () => {
			let renderContext;

			await act(async () => {
				renderContext = render(<ContactForm contact={contact} onCancel={onCancel} onSave={onSave} />);
			});

			const { asFragment, getAllByTestId, getByTestId } = renderContext;

			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NAME);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NETWORK);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.ADDRESS);
			expect(getByTestId("contact-form__address-list")).toBeTruthy();
			expect(getByTestId("contact-form__save-btn")).toBeTruthy();
			expect(getByTestId("contact-form__delete-btn")).toBeTruthy();
			expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().count());
			expect(asFragment()).toMatchSnapshot();
		});

		it("should call onDelete callback", async () => {
			let renderContext: any;

			await act(async () => {
				renderContext = render(
					<ContactForm
						contact={contact}
						networks={networks}
						onCancel={onCancel}
						onDelete={onDelete}
						onSave={onSave}
					/>,
				);
			});

			await act(async () => {
				fireEvent.click(renderContext.getByTestId("contact-form__delete-btn"));
			});

			expect(onDelete).toHaveBeenCalled();
		});
	});
});
