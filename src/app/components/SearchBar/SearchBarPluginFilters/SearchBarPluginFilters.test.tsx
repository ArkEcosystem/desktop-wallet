import React from "react";
import { act, fireEvent, render } from "testing-library";

import { SearchBarPluginFilters } from "./SearchBarPluginFilters";

describe("SearchBarPluginFilters", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<SearchBarPluginFilters />);
		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render ratings", () => {
		const ratings = [5, 4, 3, 2, 1];
		const { asFragment, getByTestId } = render(<SearchBarPluginFilters ratings={ratings} />);
		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});
		expect(getByTestId("SearchBarPluginFilters-rating-4")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render categories", () => {
		const categories = [
			{
				label: "Game",
				value: "game",
			},
		];
		const ratings = [5, 4, 3, 2, 1];
		const { asFragment, getByTestId } = render(
			<SearchBarPluginFilters ratings={ratings} categories={categories} />,
		);
		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});
		expect(getByTestId("SearchBarPluginFilters-category-game")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
