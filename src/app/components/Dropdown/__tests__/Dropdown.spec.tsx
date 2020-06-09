import React from "react";
import { render, fireEvent, getByText } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

import { Dropdown } from "../Dropdown";
import { clickOutsideHandler } from "../hooks";

describe("Dropdown", () => {
	beforeEach(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	it("should render", () => {
		const { container } = render(<Dropdown></Dropdown>);
		expect(container).toMatchSnapshot();
	});

	it("should render toggle icon", () => {
		const { container, getByTestId } = render(<Dropdown></Dropdown>);
		expect(container).toMatchSnapshot();
		expect(getByTestId("dropdown__toggle")).toBeTruthy();
	});

	it("should render with options", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
		const { container } = render(<Dropdown options={options}></Dropdown>);
		expect(container).toMatchSnapshot();
	});

	it("should open dropdown options on icon click", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: -"2" },
		];
		const { getByTestId } = render(<Dropdown options={options}></Dropdown>);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});
		expect(getByTestId("dropdown__content")).toBeTruthy();
	});

	it("should select option", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
		const onSelect = jest.fn();
		const { getByTestId } = render(<Dropdown options={options} onSelect={onSelect}></Dropdown>);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(onSelect).toBeCalledWith({ label: "Option 1", value: "1" });
	});

	it("should ignore triggering onSelect callback if not exists", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
		const { getByTestId, container } = render(<Dropdown options={options}></Dropdown>);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});

	it("shoucd close dropdown content when click outside", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
		const onSelect = () => ({});
		const { getByTestId, container } = render(
			<div>
				<div data-testid="dropdown__outside" className="mt-16">
					outside elememt to be clicked
				</div>
				<div className="m-16">
					<Dropdown options={options} onSelect={onSelect}></Dropdown>
				</div>
			</div>,
		);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		const outsideElement = getByTestId("dropdown__outside");
		expect(outsideElement).toBeTruthy();

		act(() => {
			fireEvent.mouseDown(outsideElement);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});
});

describe("ClickOutside Hook", () => {
	it("should not call callback if clicked on target element", () => {
		const el = document;
		const ref = { current: el };
		const cb = jest.fn();
		clickOutsideHandler(ref, cb);

		act(() => {
			fireEvent.mouseDown(el);
		});
		expect(cb).not.toBeCalled();
	});

	it("should call callback if clicked outside target element", () => {
		const div = document.createElement("div");
		const ref = { current: div };

		const cb = jest.fn();
		clickOutsideHandler(ref, cb);

		act(() => {
			fireEvent.mouseDown(document);
		});
		expect(cb).toBeCalled();
	});

	it("should do nothing if callback is not provided", () => {
		const div = document.createElement("div");
		const ref = { current: div };

		clickOutsideHandler(ref, null);

		act(() => {
			fireEvent.mouseDown(document);
		});
	});
});
