import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { SelectDropdown } from "./SelectDropdown";

describe("SelectDropdown", () => {
	it("should render", () => {
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
		const { container } = render(<SelectDropdown options={options} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with initial value", () => {
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
		const { container } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				selected={{ label: "Option 1", value: "1" }}
				options={options}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with custom toggle and option templates", () => {
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
		const { container } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should close if clicked outside", () => {
		const options = [
			{
				label: "Test Option 1",
				value: "1",
			},
			{
				label: "Test Option 2",
				value: "2",
			},
			{
				label: "Test Option 3",
				value: "3",
			},
		];
		const { container, getByTestId } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
			/>,
		);

		const toggle = getByTestId("select-dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("select-dropdown__content")).toBeTruthy();

		act(() => {
			fireEvent.click(toggle);
		});

		expect(() => getByTestId("select-dropdown__content")).toThrow(/Unable to find an element by/);
		expect(container).not.toHaveTextContent("Test Option");
		expect(container).toMatchSnapshot();
	});

	it("should toggle dropdown content", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
			/>,
		);
		const toggle = getByTestId("select-dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("select-dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("select-dropdown__option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});
	});

	it("should call on change callback if provided", () => {
		const fn = jest.fn();
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
				onChange={fn}
			/>,
		);
		const toggle = getByTestId("select-dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("select-dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("select-dropdown__option-0");

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(fn).toHaveBeenCalled();
	});

	it("should ignore on change callback if not provided", () => {
		const fn = jest.fn();
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
			/>,
		);
		const toggle = getByTestId("select-dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("select-dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("select-dropdown__option-0");

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(fn).not.toHaveBeenCalled();
	});

	it("should render without option content", () => {
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
		const { container } = render(
			<SelectDropdown
				option={(option: any) => <div>{option.label}</div>}
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should toggle dropdown content without option content", () => {
		const options = [{ label: "Option 1", value: "1" }];
		const { getByTestId } = render(
			<SelectDropdown
				toggle={() => {
					return (
						<div className="flex items-center flex-inline">
							<div className="font-semibold text-theme-neutral-800">Select Option</div>
						</div>
					);
				}}
				options={options}
			/>,
		);
		const toggle = getByTestId("select-dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("select-dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("select-dropdown__option-0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});
	});
});
