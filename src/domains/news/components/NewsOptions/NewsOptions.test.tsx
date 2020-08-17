import React from "react";
import { act, fireEvent,render } from "testing-library";

import { assets, categories } from "../../data";
import { translations } from "../../i18n";
import { NewsOptions } from "./NewsOptions";

describe("NewsOptions", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<NewsOptions defaultCategories={categories} selectedAssets={assets} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select category", () => {
		const onCategoryChange = jest.fn();
		const { getByTestId } = render(
			<NewsOptions defaultCategories={categories} selectedAssets={assets} onCategoryChange={onCategoryChange} />,
		);

		act(() => {
			fireEvent.click(getByTestId(`NewsOptions__category-${translations.CATEGORIES.TECHNICAL}`));
		});

		expect(onCategoryChange).toBeCalledWith(
			expect.arrayContaining([{ isSelected: true, name: translations.CATEGORIES.TECHNICAL }]),
		);
	});

	it("should handle search input", () => {
		const onSearch = jest.fn();
		const { getByTestId } = render(
			<NewsOptions defaultCategories={categories} selectedAssets={assets} onSearch={onSearch} />,
		);

		act(() => {
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "test query",
				},
			});
		});

		expect(onSearch).toBeCalledWith("test query");
	});

	it("should select asset", () => {
		const onAssetChange = jest.fn();
		const { getByTestId } = render(
			<NewsOptions defaultCategories={categories} selectedAssets={assets} onAssetChange={onAssetChange} />,
		);

		const arkOption = getByTestId("network__option--0");
		act(() => {
			fireEvent.click(arkOption);
		});

		expect(onAssetChange).toBeCalledWith(
			expect.arrayContaining([{ coin: "ark", isSelected: true, name: "Ark" }]),
			expect.anything(),
		);
	});

	it("should emit onSubmit with all selected filters", () => {
		const onSubmit = jest.fn();
		const { getByTestId } = render(
			<NewsOptions defaultCategories={categories} selectedAssets={assets} onSubmit={onSubmit} />,
		);

		act(() => {
			fireEvent.click(getByTestId(`NewsOptions__category-${translations.CATEGORIES.TECHNICAL}`));
			fireEvent.click(getByTestId("network__option--0"));
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "test query",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		expect(onSubmit).toBeCalledWith({
			assets: expect.arrayContaining([{ coin: "ark", isSelected: true, name: "Ark" }]),
			searchQuery: expect.stringMatching("test query"),
			categories: expect.arrayContaining([{ isSelected: true, name: translations.CATEGORIES.TECHNICAL }]),
		});
	});
});
