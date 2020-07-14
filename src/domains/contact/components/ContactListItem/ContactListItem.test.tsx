import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testing-library";

import { contact1 as contact } from "../../data";
import { ContactListItem } from "./ContactListItem";

const option = [{ label: "Option 1", value: "1" }];
const options = [
	{ label: "Option 1", value: "1" },
	{ label: "Option 1", value: "1" },
];

describe("ContactListItem", () => {
	it("should render", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with one option", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} options={option} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with multiple options", () => {
		const { asFragment } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} options={options} />
				</tbody>
			</table>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onAction callback if provided with one option", () => {
		const onAction = jest.fn();

		const options = [{ label: "Option 1", value: "1" }];

		const { getByTestId } = render(
			<table>
				<tbody>
					<ContactListItem contact={contact} onAction={onAction} options={options} />
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
					<ContactListItem contact={contact} onAction={onAction} options={options} />
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
					<ContactListItem contact={contact} options={options} />
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
					<ContactListItem contact={contact} onAction={onAction} options={option} />
				</tbody>
			</table>,
		);

		act(() => {
			fireEvent.click(getByTestId("ContactListItem__one-option-button-0"));
		});

		const address = contact.addresses?.()[0].address;
		expect(onAction).toHaveBeenCalledWith(option[0], expect.objectContaining({ address }));
	});
});
