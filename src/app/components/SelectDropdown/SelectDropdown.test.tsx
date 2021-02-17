import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render, waitFor } from "testing-library";

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
		const { getByTestId } = render(<Select options={options} />);

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
		const { getByTestId } = render(<Select options={options} />);

		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		const firstOption = getByTestId("select-list__toggle-option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.mouseDown(firstOption);
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");
	});

	it("should highlight option", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(<Select options={options} />);

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
		const { getByTestId } = render(<Select options={options} />);

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

	it("should show typeahead when typing has found at least one match", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		expect(getByTestId("SelectDropdownInput__typeahead")).toHaveTextContent("Option 1");
	});

	it("should select first matching option with enter", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");
	});

	it("should select first matching option with tab", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Tab", code: 9 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");
	});

	it("should not select non-matching option after key input and tab", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Optt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Tab", code: 9 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("");
	});

	it("should not select first matched option after random key enter", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "A", code: 65 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("");
	});

	it("should clear selection when changing input", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "test" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "A", code: 65 });
		});
		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "B", code: 65 });
		});

		expect(getByTestId("select-list__input")).toHaveValue("");
	});

	it("should select match on blur if available", async () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.blur(selectDropdown);
		});

		await waitFor(() => expect(selectDropdown).toHaveValue("Option 1"));
	});

	it("should clear input on blur if there is no match", async () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Foobar" } });
		});

		act(() => {
			fireEvent.blur(selectDropdown);
		});

		await waitFor(() => expect(selectDropdown).toHaveValue(""));
	});

	it("should not clear input on blur if selected", () => {
		const { getByTestId } = render(<Select options={options} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Opt" } });
		});

		act(() => {
			fireEvent.keyDown(selectDropdown, { key: "Enter", code: 13 });
		});

		expect(selectDropdown).toHaveValue("Option 1");

		act(() => {
			fireEvent.blur(selectDropdown);
		});

		expect(selectDropdown).toHaveValue("Option 1");
	});

	it("should select an option by clicking on it", async () => {
		const { getByTestId } = render(<Select options={options} />);

		act(() => {
			fireEvent.focus(getByTestId("SelectDropdownInput__input"));
		});

		await waitFor(() => expect(getByTestId("select-list__toggle-option-0")).toBeTruthy());

		act(() => {
			fireEvent.mouseDown(getByTestId("select-list__toggle-option-0"));
		});

		expect(getByTestId("select-list__input")).toHaveValue("1");
	});

	it("should allow entering free text", () => {
		const { getByTestId } = render(<Select options={options} allowFreeInput />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Test" } });
		});

		expect(getByTestId("select-list__input")).toHaveValue("Test");
	});

	it("should allow entering free text and handle blur event", () => {
		const { getByTestId } = render(<Select options={options} allowFreeInput={true} />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Test" } });
		});

		act(() => {
			fireEvent.blur(selectDropdown);
		});

		expect(getByTestId("select-list__input")).toHaveValue("Test");
	});

	it("should render with default value when free text is allowed", () => {
		const { container, getByTestId } = render(<Select options={options} defaultValue="3" allowFreeInput />);
		expect(getByTestId("select-list__input")).toHaveValue("3");
		expect(container).toMatchSnapshot();
	});

	it("should hide dropdown when no matches found in free text mode", () => {
		const { getByTestId } = render(<Select options={options} defaultValue="3" allowFreeInput />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");
		act(() => {
			fireEvent.change(selectDropdown, { target: { value: options[0].label } });
		});
		expect(getByTestId("select-list__input")).toHaveValue(options[0].label);

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "Unmatched" } });
		});
		expect(() => getByTestId("select-list__toggle-option-0")).toThrow();
	});

	it("should show all options when empty input", () => {
		const { getByTestId } = render(<Select options={options} defaultValue="3" allowFreeInput />);
		const selectDropdown = getByTestId("SelectDropdownInput__input");
		act(() => {
			fireEvent.change(selectDropdown, { target: { value: options[0].label } });
		});
		expect(getByTestId("select-list__input")).toHaveValue(options[0].label);

		act(() => {
			fireEvent.change(selectDropdown, { target: { value: "" } });
		});

		expect(getByTestId("select-list__input")).toHaveValue("");
		expect(getByTestId("select-list__toggle-option-0")).toBeTruthy();
		expect(getByTestId("select-list__toggle-option-1")).toBeTruthy();
		expect(getByTestId("select-list__toggle-option-2")).toBeTruthy();
	});
});
