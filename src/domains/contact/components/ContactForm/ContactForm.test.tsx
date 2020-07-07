/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { contact2 as contact } from "../../data";
import { translations } from "../../i18n";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
	const networks = [
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

	const onDelete = jest.fn();
	const onSave = jest.fn();
	const onCancel = jest.fn();

	it("should select network", () => {
		const { getByTestId } = render(<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />);

		const input = getByTestId("select-asset__input");
		act(() => {
			fireEvent.change(input, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();
	});

	it("should add an address", async () => {
		const { getAllByTestId, getByTestId, queryByTestId } = render(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		const assetInput = getByTestId("select-asset__input");
		const addressInput = getByTestId("contact-form__address-input");

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
			expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(contact.addresses().length);
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
