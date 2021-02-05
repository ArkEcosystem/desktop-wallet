/* eslint-disable @typescript-eslint/require-await */
import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock as networks } from "domains/network/data";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { ContactForm } from "./ContactForm";

const onDelete = jest.fn();
const onSave = jest.fn();
const onCancel = jest.fn();

let contact: Contact;
let validArkDevnetAddress: string;

describe("ContactForm", () => {
	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const [wallet] = profile.wallets().values();
		validArkDevnetAddress = wallet.address();
		contact = profile.contacts().values()[0];
	});

	it("should select", () => {
		const { asFragment } = renderWithRouter(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select with errors", () => {
		const { asFragment } = renderWithRouter(
			<ContactForm
				networks={networks}
				onCancel={onCancel}
				onSave={onSave}
				errors={{ name: "Contact name error" }}
			/>,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle onChange event", async () => {
		const fn = jest.fn();
		const { getByTestId } = renderWithRouter(
			<ContactForm networks={networks} onChange={fn} onSave={onSave} errors={{ name: "Contact name error" }} />,
		);

		const input = getByTestId("contact-form__name-input");
		act(() => {
			fireEvent.change(input, { target: { value: "Sample name" } });
		});

		await waitFor(() => {
			expect(fn).toHaveBeenCalled();
		});
	});

	it("should select cryptoasset", () => {
		const { getByTestId } = renderWithRouter(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		act(() => {
			fireEvent.change(selectNetworkInput, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("Bitcoin");
	});

	it("should add a valid address successfully", async () => {
		const { getAllByTestId, getByTestId, queryByTestId } = renderWithRouter(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: validArkDevnetAddress },
			});

			fireEvent.change(getByTestId("contact-form__name-input"), {
				target: { value: "name" },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });

			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => {
				expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
			});

			fireEvent.click(getByTestId("contact-form__add-address-btn"));
			await waitFor(() => {
				expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
			});
		});
	});

	it("should not add invalid address and should display error message", async () => {
		const { getAllByTestId, getByTestId, queryByTestId } = renderWithRouter(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: "invalid address" },
			});

			fireEvent.change(getByTestId("contact-form__name-input"), {
				target: { value: "name" },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });

			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => {
				expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
			});

			fireEvent.click(getByTestId("contact-form__add-address-btn"));
			await waitFor(() => {
				expect(getByTestId("Input-error")).toBeVisible();
				expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);
			});
		});
	});

	it("should error when adding duplicate address", async () => {
		const { getAllByTestId, getByTestId, queryByTestId } = renderWithRouter(
			<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />,
		);

		expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			fireEvent.change(getByTestId("contact-form__name-input"), {
				target: { value: "name" },
			});

			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: validArkDevnetAddress },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });

			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => {
				expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
			});

			fireEvent.click(getByTestId("contact-form__add-address-btn"));

			await waitFor(() => {
				expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
			});

			// Second addition
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: validArkDevnetAddress },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });

			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => {
				expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
			});

			fireEvent.click(getByTestId("contact-form__add-address-btn"));

			await waitFor(() => {
				expect(getByTestId("Input-error")).toBeVisible();
				expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1);
			});
		});
	});

	it("should remove an address", async () => {
		let renderContext: any;

		await act(async () => {
			renderContext = renderWithRouter(
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
		const fn = jest.fn();
		const { getByTestId, queryByTestId } = renderWithRouter(
			<ContactForm networks={networks} onCancel={onCancel} onSave={fn} />,
		);

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");

		await act(async () => {
			await fireEvent.change(getByTestId("contact-form__address-input"), {
				target: { value: validArkDevnetAddress },
			});

			fireEvent.change(getByTestId("contact-form__name-input"), {
				target: { value: "name" },
			});

			fireEvent.change(selectNetworkInput, { target: { value: "ARK Devnet" } });

			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			await waitFor(() => {
				expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled();
			});
		});

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__add-address-btn"));
		});

		await act(async () => {
			fireEvent.click(getByTestId("contact-form__save-btn"));
		});

		await waitFor(() => {
			expect(fn).toHaveBeenCalled();
		});
	});

	describe("when creating a new contact", () => {
		it("should render the form", () => {
			const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
				<ContactForm onCancel={onCancel} onSave={onSave} />,
			);

			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NAME);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.CRYPTOASSET);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.ADDRESS);
			expect(getByTestId("contact-form__save-btn")).toBeTruthy();
			expect(() => getAllByTestId("contact-form__address-list")).toThrow(/Unable to find an element by/);
			expect(() => getAllByTestId("contact-form__delete-btn")).toThrow(/Unable to find an element by/);
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe("when editing an existing contact", () => {
		it("should render the form", async () => {
			let renderContext: any;

			await act(async () => {
				renderContext = renderWithRouter(<ContactForm contact={contact} onCancel={onCancel} onSave={onSave} />);
			});

			const { asFragment, getAllByTestId, getByTestId } = renderContext;

			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.NAME);
			expect(getByTestId("contact-form")).toHaveTextContent(translations.CONTACT_FORM.CRYPTOASSET);
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
				renderContext = renderWithRouter(
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
