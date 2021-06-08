/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { HeaderSearchBar } from "./HeaderSearchBar";

describe("HeaderSearchBar", () => {
	it("should render", () => {
		const { asFragment, getByRole, getByTestId } = render(<HeaderSearchBar />);

		expect(getByRole("button")).toHaveTextContent("Search");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show the searchbar", () => {
		const { getByRole, getByTestId } = render(<HeaderSearchBar />);

		fireEvent.click(getByRole("button"));

		expect(getByTestId("HeaderSearchBar__input")).toBeTruthy();
	});

	it("should reset fields by prop", async () => {
		const onReset = jest.fn();
		const { getByRole, getByTestId, rerender } = render(<HeaderSearchBar onReset={onReset} />);

		fireEvent.click(getByRole("button"));

		const input = getByTestId("Input") as HTMLInputElement;

		act(() => {
			fireEvent.change(input, {
				target: {
					value: "test",
				},
			});
		});

		expect(input.value).toBe("test");

		rerender(<HeaderSearchBar onReset={onReset} resetFields={true} />);

		await waitFor(() => expect(input.value).not.toBe("test"));
		expect(onReset).toHaveBeenCalled();
	});

	it("should show extra slot", () => {
		const { getByRole, getByTestId } = render(<HeaderSearchBar extra={<div data-testid="extra-slot" />} />);

		fireEvent.click(getByRole("button"));

		expect(getByTestId("extra-slot")).toBeTruthy();
	});

	it("should hide the searchbar when clicked outside", () => {
		const onSearch = jest.fn();

		const { getByRole, getByTestId } = render(
			<div>
				<div data-testid="header-search-bar__outside" className="mt-16">
					outside elememt to be clicked
				</div>

				<HeaderSearchBar onSearch={onSearch} />
			</div>,
		);

		fireEvent.click(getByRole("button"));

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
		const { getByRole, getByTestId } = render(<HeaderSearchBar onReset={onReset} />);

		fireEvent.click(getByRole("button"));

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

		const { getByRole, getByTestId } = render(<HeaderSearchBar onSearch={onSearch} />);

		fireEvent.click(getByRole("button"));

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

		const { getByRole, getByTestId } = render(<HeaderSearchBar onSearch={onSearch} debounceTimeout={100} />);

		fireEvent.click(getByRole("button"));

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
