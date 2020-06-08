import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

import { Dropdown } from "../Dropdown";

describe("Dropdown", () => {
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
			{ label: "Option 2", value: "2" },
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
});
