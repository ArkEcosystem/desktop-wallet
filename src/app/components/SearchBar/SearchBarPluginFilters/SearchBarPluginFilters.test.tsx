import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

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

	it("should render with selected values", () => {
		const categories = [
			{
				label: "Game",
				value: "game",
			},
		];

		const initialValues = {
			rating: 1,
			categories: ["game"],
			claimed: true,
		};

		const { asFragment, getByTestId } = render(
			<SearchBarPluginFilters categories={categories} initialValues={initialValues} />,
		);
		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});
		expect(getByTestId("SearchBarPluginFilters-category-game")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit onChange event ", () => {
		const fn = jest.fn();
		const categories = [
			{
				label: "Utility",
				value: "utility",
			},
			{
				label: "Game",
				value: "game",
			},
		];

		const initialValues = {
			rating: 1,
			categories: [],
			claimed: true,
		};

		const { getByTestId } = render(
			<SearchBarPluginFilters categories={categories} initialValues={initialValues} onReset={fn} />,
		);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const resetLink = getByTestId("SearchBarPluginFilters-reset");
		expect(resetLink).toBeTruthy();

		act(() => {
			fireEvent.click(resetLink);
		});

		waitFor(() => expect(fn).toHaveBeenCalled());
	});

	it("should check rating", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SearchBarPluginFilters onChange={fn} />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const gameCheckbox = getByTestId("SearchBarPluginFilters-rating-2");
		expect(gameCheckbox).toBeTruthy();

		act(() => {
			fireEvent.click(gameCheckbox);
		});

		expect(fn).toBeCalledWith({ rating: 2, categories: [], claimed: false });
	});

	it("should check claimed checkbox", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SearchBarPluginFilters onChange={fn} />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const gameCheckbox = getByTestId("SearchBarPluginFilters-claimed");
		expect(gameCheckbox).toBeTruthy();

		act(() => {
			fireEvent.click(gameCheckbox);
		});

		expect(fn).toBeCalledWith({ rating: null, categories: [], claimed: true });
	});

	it("should check category", () => {
		const fn = jest.fn();
		const categories = [
			{
				label: "Utility",
				value: "utility",
			},
			{
				label: "Game",
				value: "game",
			},
		];
		const { getByTestId } = render(<SearchBarPluginFilters onChange={fn} categories={categories} />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const gameCheckbox = getByTestId("SearchBarPluginFilters-category-game");
		expect(gameCheckbox).toBeTruthy();

		act(() => {
			fireEvent.click(gameCheckbox);
		});

		expect(fn).toBeCalledWith({ rating: null, categories: ["game"], claimed: false });
	});

	it("should uncheck category", () => {
		const fn = jest.fn();
		const categories = [
			{
				label: "Utility",
				value: "utility",
			},
			{
				label: "Game",
				value: "game",
			},
		];

		const initialValues = {
			rating: 1,
			categories: ["game"],
			claimed: true,
		};
		const { getByTestId } = render(
			<SearchBarPluginFilters onChange={fn} categories={categories} initialValues={initialValues} />,
		);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const gameCheckbox = getByTestId("SearchBarPluginFilters-category-game");
		expect(gameCheckbox).toBeTruthy();

		act(() => {
			fireEvent.click(gameCheckbox);
		});

		expect(fn).toBeCalledWith({ rating: 1, categories: [], claimed: true });
	});

	it("should not emit onChange event upon category change", () => {
		const fn = jest.fn();
		const categories = [
			{
				label: "Utility",
				value: "utility",
			},
			{
				label: "Game",
				value: "game",
			},
		];

		const initialValues = {
			rating: 1,
			categories: ["game"],
			claimed: true,
		};
		const { getByTestId } = render(
			<SearchBarPluginFilters categories={categories} initialValues={initialValues} />,
		);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const gameCheckbox = getByTestId("SearchBarPluginFilters-category-game");
		expect(gameCheckbox).toBeTruthy();

		act(() => {
			fireEvent.click(gameCheckbox);
		});

		expect(fn).not.toBeCalled();
	});

	it("should render with null initialValues", () => {
		const categories = [
			{
				label: "Utility",
				value: "utility",
			},
			{
				label: "Game",
				value: "game",
			},
		];

		const initialValues = {
			rating: null,
			categories: null,
			claimed: true,
		};
		const { getByTestId, asFragment } = render(
			<SearchBarPluginFilters categories={categories} initialValues={initialValues} />,
		);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
