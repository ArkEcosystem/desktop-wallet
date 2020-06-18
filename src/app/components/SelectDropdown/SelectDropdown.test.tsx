import { render } from "@testing-library/react";
// import { act } from "@testing-library/react-hooks";
import React from "react";

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
		const { container } = render(<SelectDropdown options={options}></SelectDropdown>);
		expect(container).toMatchSnapshot();
	});

	it("should render ignoring option.value property", () => {
		const options = [
			{
				label: "Option 1",
			},
			{
				label: "Option 2",
			},
			{
				label: "Option 3",
			},
		];
		const { container } = render(<SelectDropdown options={options}></SelectDropdown>);
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
				option={(option: any) => {
					return <div>{option.label}</div>;
				}}
				toggle={() => {
					return (
						<div className="flex flex-inline items-center">
							<div className="text-theme-neutral-800 font-semibold">Select Option</div>
						</div>
					);
				}}
				options={options}
			></SelectDropdown>,
		);
		expect(container).toMatchSnapshot();
	});

	// it("should ignore triggering onSelect callback if not exists", () => {
	// 	const options = [
	// 		{ label: "Option 1", value: "1" },
	// 		{ label: "Option 2", value: "2" },
	// 	];
	// 	const { getByTestId, container } = render(<Dropdown options={options}></Dropdown>);
	// 	const toggle = getByTestId("dropdown__toggle");
	//
	// 	act(() => {
	// 		fireEvent.click(toggle);
	// 	});
	//
	// 	expect(getByTestId("dropdown__content")).toBeTruthy();
	//
	// 	const firstOption = getByTestId("dropdown__option--0");
	// 	expect(firstOption).toBeTruthy();
	//
	// 	act(() => {
	// 		fireEvent.click(firstOption);
	// 	});
	//
	// 	expect(container.querySelectorAll("ul").length).toEqual(0);
	// });
});
