import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act } from "react-dom/test-utils";
import { env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { ContactListItem } from "./ContactListItem";

const singleOption = [{ label: "Option 1", value: "option_1" }];

const multiOptions = [...singleOption, { label: "Option 2", value: "option_2" }];

let contact: Contracts.IContact;
``;

describe("ContactListItem", () => {
	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		contact = profile.contacts().values()[0];
	});

	it("should render", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as delegate", () => {
		const delegateContact = {
			addresses: () => ({
				count: () => 1,
				values: () => [
					{
						address: () => "id5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
						coin: () => "ARK",
						hasSyncedWithNetwork: () => true,
						isDelegate: () => true,
						network: () => "ark.devnet",
					},
				],
			}),
			avatar: () => "data:image/png;base64,avatarImage",
			id: () => "id5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
			name: () => "Caio",
		};

		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem item={delegateContact} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render using variant", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} variant="condensed" />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with multiple addresses", async () => {
		await contact.addresses().create({
			address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
			coin: "ARK",
			name: "test",
			network: "ark.devnet",
		});

		await contact.addresses().create({
			address: "DKrACQw7ytoU2gjppy3qKeE2dQhZjfXYqu",
			coin: "ARK",
			name: "test2",
			network: "ark.devnet",
		});

		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with one option", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} options={singleOption} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with multiple options", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} options={multiOptions} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onAction callback if provided with one option", () => {
		const onAction = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onAction={onAction} options={singleOption} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		expect(onAction).toHaveBeenCalled();
	});

	it("should call onAction callback if provided with one option in my contacts", () => {
		const onAction = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onAction={onAction} options={singleOption} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		expect(onAction).toHaveBeenCalled();
	});

	it("should call onAction callback if provided with multiple options", () => {
		const onAction = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onAction={onAction} options={multiOptions} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onAction).toHaveBeenCalled();
	});

	it("should call onAction callback if provided with multiple options in my contacts", () => {
		const onAction = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onAction={onAction} options={multiOptions} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onAction).toHaveBeenCalled();
	});

	it("should not call onAction callback if not provided with multiple options", () => {
		const onAction = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} options={multiOptions} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onAction).not.toHaveBeenCalled();
	});

	it("should not call onAction callback if not provided with multiple options in my contacts", () => {
		const onAction = jest.fn();

		const { getAllByTestId, getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} options={multiOptions} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getAllByTestId("dropdown__toggle")[0]);
		});

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		expect(onAction).not.toHaveBeenCalled();
	});

	it("should call onAction callback with given values", () => {
		const onAction = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onAction={onAction} options={singleOption} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		expect(onAction).toHaveBeenCalledWith(
			{ label: "Option 1", value: "option_1" },
			"D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		);
	});

	it("should call onAction callback with given values in my contacts", () => {
		const onAction = jest.fn();

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onAction={onAction} options={singleOption} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		expect(onAction).toHaveBeenCalledWith(
			{ label: "Option 1", value: "option_1" },
			"D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		);
	});

	it("should call send", () => {
		const onSend = jest.fn();

		const { getAllByTestId } = render(
			<table>
				<tbody>
					<ContactListItem item={contact} onSend={onSend} options={singleOption} />
				</tbody>
			</table>,
		);

		fireEvent.click(getAllByTestId("ContactListItem__send-button")[0]);

		expect(onSend).toHaveBeenCalled();
	});
});
