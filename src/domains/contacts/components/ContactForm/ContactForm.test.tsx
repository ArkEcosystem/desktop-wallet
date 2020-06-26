/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { contact2 as contact } from "../../data";
import { translations } from "../../i18n";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
	const networks = [
		{
			label: "Ark Ecosystem",
			value: "ark",
			icon: "Ark",
		},
	];

	const onDelete = jest.fn();
	const onSave = jest.fn();
	const onCancel = jest.fn();

	it("should select network", async () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		await act(async () => {
			fireEvent.change(getByTestId("contact-form__network-select"), {
				target: { value: "ark" },
			});
		});

		const options = getAllByTestId("contact-form__network-option");

		expect((options[0] as HTMLOptionElement).selected).toBeTruthy();
		expect(asFragment).toMatchSnapshot();
	});

	it("should add an address", async () => {
		const { asFragment, getAllByTestId, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />
			</I18nextProvider>,
		);

		expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.change(getByTestId("contact-form__network-select"), {
				target: { value: "ark" },
			});

			fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: "address" },
			});
		});

    expect(() => queryByTestId("contact-form__add-address-btn").not.toHaveAttribute("disabled"));

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__add-address-btn"));
		});

		expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
	});

	it("should remove an address", async () => {
		let renderContext;

		await act(async () => {
			renderContext = render(
				<ContactForm contact={contact} networks={networks} onCancel={onCancel} onSave={onSave} />,
			);
		});

		const { getAllByTestId } = renderContext;

		expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().length);

		await act(async () => {
			fireEvent.click(getAllByTestId("contact-form__remove-address-btn")[0]);
		});

		expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().length - 1);
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
				<I18nextProvider i18n={i18n}>
					<ContactForm onCancel={onCancel} onSave={onSave} />
				</I18nextProvider>,
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
				renderContext = render(
					<I18nextProvider i18n={i18n}>
						<ContactForm contact={contact} onCancel={onCancel} onSave={onSave} />
					</I18nextProvider>,
				);
			});

			const { asFragment, getAllByTestId, getByTestId } = renderContext;

			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NAME);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NETWORK);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.ADDRESS);
			expect(getByTestId("contact-form__address-list")).toBeTruthy();
			expect(getByTestId("contact-form__save-btn")).toBeTruthy();
			expect(getByTestId("contact-form__delete-btn")).toBeTruthy();
			expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().length);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should call onDelete callback", async () => {
			let renderContext;

			await act(async () => {
				renderContext = render(
					<ContactForm contact={contact} networks={networks} onCancel={onCancel} onDelete={onDelete} onSave={onSave} />,
				);
			});

			await act(async () => {
				fireEvent.click(renderContext.getByTestId("contact-form__delete-btn"));
			});

			expect(onDelete).toHaveBeenCalled();
		});
	});
});
