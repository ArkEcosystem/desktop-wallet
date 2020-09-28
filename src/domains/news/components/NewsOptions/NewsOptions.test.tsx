import React from "react";
import { act, fireEvent, render } from "testing-library";

import { NewsOptions } from "./NewsOptions";

const categories = ["Technical"];
const coins = ["ark"];

describe("NewsOptions", () => {
	it("should render", () => {
		const { container, asFragment } = render(<NewsOptions selectedCategories={categories} selectedCoins={coins} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select category", () => {
		const { getByTestId } = render(
			<NewsOptions selectedCategories={categories} selectedCoins={coins} onSubmit={jest.fn()} />,
		);

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__category-Technical"));
		});
	});

	it("should handle search input", () => {
		const onSearch = jest.fn();

		const { getByTestId } = render(
			<NewsOptions
				selectedCategories={categories}
				selectedCoins={coins}
				onSearch={onSearch}
				onSubmit={jest.fn()}
			/>,
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

	it("should limit search query to 32 letters", () => {
		const onSearch = jest.fn();
		const { getByTestId } = render(
			<NewsOptions selectedCategories={categories} selectedCoins={coins} onSearch={onSearch} />,
		);

		act(() => {
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "1111111111000000000011111111110000000000",
				},
			});
		});

		expect(onSearch).toBeCalledWith("11111111110000000000111111111100");
	});

	it("should select asset", () => {
		const { getByTestId } = render(<NewsOptions selectedCategories={categories} selectedCoins={coins} />);

		const arkOption = getByTestId("network__option--0");
		act(() => {
			fireEvent.click(arkOption);
		});
	});

	it("should emit onSubmit with all selected filters", () => {
		const onSubmit = jest.fn();

		const { getByTestId } = render(
			<NewsOptions selectedCategories={categories} selectedCoins={coins} onSubmit={onSubmit} />,
		);

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__category-Technical"));
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
			categories: expect.arrayContaining(["Technical"]),
			coins: expect.arrayContaining(["ark"]),
			searchQuery: expect.stringMatching("test query"),
		});
	});
});
