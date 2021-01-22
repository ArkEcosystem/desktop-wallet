import { act } from "@testing-library/react-hooks";
import { clickOutsideHandler } from "app/hooks/click-outside";
import React from "react";
import { fireEvent, render } from "testing-library";

import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
	it("should render", () => {
		const { container } = render(<Dropdown />);
		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { container } = render(<Dropdown toggleSize="sm" />);
		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Dropdown toggleSize="lg" />);
		expect(container).toMatchSnapshot();
	});

	it("should render toggle icon", () => {
		const { container, getByTestId } = render(<Dropdown />);
		expect(container).toMatchSnapshot();
		expect(getByTestId("dropdown__toggle")).toBeTruthy();
	});

	it("should render with options", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];
		const { container } = render(<Dropdown options={options} />);
		expect(container).toMatchSnapshot();
	});

	it("should open dropdown options on icon click", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: -"2" },
		];
		const { getByTestId } = render(<Dropdown options={options} />);
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
		const { getByTestId } = render(<Dropdown options={options} onSelect={onSelect} />);
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
		const { getByTestId, container } = render(<Dropdown options={options} />);
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
					<Dropdown options={options} onSelect={onSelect} />
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

	it("should render with custom toggle content as react element", () => {
		const { container } = render(<Dropdown toggleContent={<div>custom toggle</div>} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with custom toggle content as function", () => {
		const { container } = render(
			<Dropdown toggleContent={(isOpen: boolean) => <div>Dropdown is open: {isOpen}</div>} />,
		);
		expect(container).toMatchSnapshot();
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

	describe("positioning", () => {
		it("it should render content below toggle", () => {
			const documentClientHeightSpy = jest.spyOn(document.body, "clientHeight", "get").mockReturnValue(50);
			const getComputedStyleSpy = jest
				.spyOn(window, "getComputedStyle")
				.mockReturnValueOnce({ marginTop: "10px" });

			const { getByTestId } = render(
				<Dropdown>
					<span>hello</span>
				</Dropdown>,
			);
			const toggle = getByTestId("dropdown__toggle");

			act(() => {
				fireEvent.click(toggle);
			});

			expect(getByTestId("dropdown__content")).toHaveAttribute("style", "opacity: 100;");

			documentClientHeightSpy.mockRestore();
			getComputedStyleSpy.mockRestore();
		});

		it("should render content below toggle and reduce its height", () => {
			const getBoundingClientRectSpy = jest
				.spyOn(Element.prototype, "getBoundingClientRect")
				.mockReturnValue({ height: 90, top: 0 });
			const toggleHeightSpy = jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValueOnce(10);
			const dropdownHeightSpy = jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(100);
			const documentClientHeightSpy = jest.spyOn(document.body, "clientHeight", "get").mockReturnValue(100);
			const elementClientHeightSpy = jest.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(100);

			const { getByTestId } = render(
				<Dropdown>
					<span>hello</span>
				</Dropdown>,
			);
			const toggle = getByTestId("dropdown__toggle");

			act(() => {
				fireEvent.click(toggle);
			});

			expect(getByTestId("dropdown__content")).toHaveAttribute(
				"style",
				"opacity: 100; height: 60px; overflow-y: scroll;",
			);

			getBoundingClientRectSpy.mockRestore();
			toggleHeightSpy.mockRestore();
			dropdownHeightSpy.mockRestore();
			documentClientHeightSpy.mockRestore();
			elementClientHeightSpy.mockRestore();
		});

		it("should render content above toggle and apply a negative margin", () => {
			const getBoundingClientRectSpy = jest
				.spyOn(Element.prototype, "getBoundingClientRect")
				.mockReturnValue({ height: 50, top: 100 });
			const offsetHeightSpy = jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(50);
			const documentClientHeightSpy = jest.spyOn(document.body, "clientHeight", "get").mockReturnValue(150);

			const { getByTestId } = render(
				<Dropdown>
					<span>hello</span>
				</Dropdown>,
			);
			const toggle = getByTestId("dropdown__toggle");

			act(() => {
				fireEvent.click(toggle);
			});

			expect(getByTestId("dropdown__content")).toHaveAttribute("style", "opacity: 100; margin-top: -100px;");

			getBoundingClientRectSpy.mockRestore();
			offsetHeightSpy.mockRestore();
			documentClientHeightSpy.mockRestore();
		});
	});
});
