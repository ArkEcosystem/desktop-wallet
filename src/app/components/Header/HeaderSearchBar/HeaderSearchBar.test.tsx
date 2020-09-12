/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { HeaderSearchBar } from "./HeaderSearchBar";

describe("HeaderSearchBar", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<HeaderSearchBar />);

		expect(getByTestId("header-search-bar__button")).toHaveTextContent("Search");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show the searchbar", () => {
		const { getByTestId } = render(<HeaderSearchBar />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		expect(getByTestId("header-search-bar__input")).toBeTruthy();
	});

	it("should show extra slot", () => {
		const { getByTestId } = render(<HeaderSearchBar extra={<div data-testid="extra-slot" />} />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		expect(getByTestId("extra-slot")).toBeTruthy();
	});

	it("should show the with custom label slot", () => {
		const { getByTestId } = render(
			<HeaderSearchBar>
				<div data-testid="custom-content">custom</div>
			</HeaderSearchBar>,
		);

		expect(getByTestId("custom-content")).toBeTruthy();
	});

	it("should hide the searchbar when clicked outside", () => {
		const onSearch = jest.fn();

		const { getByTestId } = render(
			<div>
				<div data-testid="header-search-bar__outside" className="mt-16">
					outside elememt to be clicked
				</div>

				<HeaderSearchBar onSearch={onSearch} />
			</div>,
		);

		fireEvent.click(getByTestId("header-search-bar__button"));

		const outsideElement = getByTestId("header-search-bar__outside");
		expect(outsideElement).toBeTruthy();

		expect(() => getByTestId("Input")).toBeTruthy();

		act(() => {
			fireEvent.mouseDown(outsideElement);
		});

		expect(() => getByTestId("Input")).toThrow(/Unable to find an element by/);
	});

	it("should reset the query", () => {
		const onReset = jest.fn();
		const { getByTestId } = render(<HeaderSearchBar onReset={onReset} />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		const input = getByTestId("Input") as HTMLInputElement;

		act(() => {
			fireEvent.change(input, {
				target: {
					value: "test",
				},
			});
		});

		expect(input.value).toBe("test");

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__reset"));
		});

		expect(input.value).not.toBe("test");
		expect(onReset).toHaveBeenCalled();
	});

	it("should call onSearch", async () => {
		jest.useFakeTimers();

		const onSearch = jest.fn();

		const { getByTestId } = render(<HeaderSearchBar onSearch={onSearch} />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		act(() => {
			fireEvent.change(getByTestId("Input"), {
				target: {
					value: "test",
				},
			});
		});

		await act(async () => {
			jest.runAllTimers();
		});

		expect(onSearch).toHaveBeenCalled();
	});

	it("should set custom debounce timeout form props", async () => {
		jest.useFakeTimers();

		const onSearch = jest.fn();

		const { getByTestId } = render(<HeaderSearchBar onSearch={onSearch} debounceTimeout={100} />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		act(() => {
			fireEvent.change(getByTestId("Input"), {
				target: {
					value: "test",
				},
			});
		});

		await act(async () => {
			jest.runAllTimers();
		});

		expect(onSearch).toHaveBeenCalled();
	});
});
