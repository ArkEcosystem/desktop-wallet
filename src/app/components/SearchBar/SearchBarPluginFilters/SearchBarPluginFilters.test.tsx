import React from "react";
import { act, fireEvent, render, waitFor } from "testing-library";

import { SearchBarPluginFilters } from "./SearchBarPluginFilters";

describe("SearchBarPluginFilters", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<SearchBarPluginFilters />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render categories", () => {
		const categories = [
			{
				label: "Game",
				value: "game",
			},
		];
		const { asFragment, getByTestId } = render(<SearchBarPluginFilters categories={categories} />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		expect(getByTestId("SearchBarPluginFilters-category-game")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render default categories", () => {
		const { asFragment, getByTestId } = render(<SearchBarPluginFilters />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		expect(getByTestId("SearchBarPluginFilters-category-game")).toBeTruthy();
		expect(getByTestId("SearchBarPluginFilters-category-utility")).toBeTruthy();
		expect(getByTestId("SearchBarPluginFilters-category-exchange")).toBeTruthy();
		expect(getByTestId("SearchBarPluginFilters-category-other")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with selected values", () => {
		const categories = [
			{
				label: "Game",
				value: "game",
			},
		];

		const initialValues = { categories: ["game"] };

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

	it("should emit onChange event", async () => {
		const function_ = jest.fn();
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
			categories: [],
			claimed: true,
			rating: 1,
		};

		const { getByTestId } = render(
			<SearchBarPluginFilters categories={categories} initialValues={initialValues} onReset={function_} />,
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

		await waitFor(() => expect(function_).toHaveBeenCalled());
	});

	it("should check category", () => {
		const function_ = jest.fn();
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
		const { getByTestId } = render(<SearchBarPluginFilters onChange={function_} categories={categories} />);

		expect(getByTestId("SearchBarPluginFilters")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("dropdown__toggle"));
		});

		const gameCheckbox = getByTestId("SearchBarPluginFilters-category-game");

		expect(gameCheckbox).toBeTruthy();

		act(() => {
			fireEvent.click(gameCheckbox);
		});

		expect(function_).toBeCalledWith({ categories: ["game"] });
	});

	it("should uncheck category", () => {
		const function_ = jest.fn();
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
			categories: ["game"],
		};
		const { getByTestId } = render(
			<SearchBarPluginFilters onChange={function_} categories={categories} initialValues={initialValues} />,
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

		expect(function_).toBeCalledWith({ categories: [] });
	});

	it("should not emit onChange event upon category change", () => {
		const function_ = jest.fn();
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
			categories: ["game"],
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

		expect(function_).not.toBeCalled();
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
			categories: null,
			claimed: true,
			rating: null,
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
