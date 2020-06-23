import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

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
		const { getByTestId } = render(<HeaderSearchBar />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		const input = getByTestId("Input");

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
	});

	it("should call onSearch", (done) => {
		const onSearch = jest.fn();

		const { getByTestId } = render(<HeaderSearchBar onSearch={onSearch} />);

		fireEvent.click(getByTestId("header-search-bar__button"));

		const input = getByTestId("Input");

		act(() => {
			fireEvent.change(input, {
				target: {
					value: "test",
				},
			});
		});

		setTimeout(() => {
			expect(onSearch).toHaveBeenCalled();
			done();
		}, 550);
	});
});
