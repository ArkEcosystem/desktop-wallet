import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { Select } from "./SelectDropdown";

const options = [
	{
		label: "Option 1",
		value: "1",
	},
	{
		label: "Option 2",
		value: "2",
	},
	{
		label: "Option 3",
		value: "3",
	},
];

describe("SelectDropdown", () => {
	it("should render", () => {
		const { container } = render(<Select options={options} />);
		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container } = render(<Select options={options} isInvalid />);
		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<Select options={options} disabled />);
		expect(container).toMatchSnapshot();
	});

	it("should render with initial default value", () => {
		const { container } = render(<Select options={options} defaultValue="3" />);
		expect(container).toMatchSnapshot();
	});

	it("should render with wrong default value", () => {
		const { container } = render(<Select options={options} defaultValue="4" />);
		expect(container).toMatchSnapshot();
	});

	it("should render with empty options", () => {
		const { container } = render(<Select options={[]} defaultValue="4" />);
		expect(container).toMatchSnapshot();
	});

	it("should render with options values as numbers", () => {
		const { container } = render(<Select options={[{ label: "Value 1", value: 1 }]} defaultValue="4" />);
		expect(container).toMatchSnapshot();
	});

	it("should toggle select list options", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(<Select options={options} defaultValue="3" />);

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		const firstOption = getByTestId("select-list__toggle-option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});
	});

	it("should select option", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(<Select options={options} defaultValue="3" />);

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		const firstOption = getByTestId("select-list__toggle-option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");
	});

	it("should highlight option", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(<Select options={options} defaultValue="3" />);

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Tab", code: 9 });
		});

		const firstOption = getByTestId("select-list__toggle-option-0");
		expect(firstOption).toBeTruthy();

		expect(firstOption).toHaveClass("is-highlighted");
	});

	it("should select options with arrow keys", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(<Select options={options} defaultValue="3" />);

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Tab", code: 9 });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Backspace", code: 8 });
		});

		const firstOption = getByTestId("select-list__toggle-option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.mouseOver(firstOption);
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "ArrowDown", code: 40 });
		});

		expect(firstOption).toHaveClass("is-highlighted");

		act(() => {
			fireEvent.keyDown(firstOption, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");
	});
});
