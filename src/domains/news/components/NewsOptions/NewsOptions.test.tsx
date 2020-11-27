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

	it("should handle search input pressing the Enter key", () => {
		const onSearch = jest.fn();
		const onSubmit = jest.fn();

		const { getByTestId } = render(
			<NewsOptions
				selectedCategories={categories}
				selectedCoins={coins}
				onSearch={onSearch}
				onSubmit={onSubmit}
			/>,
		);

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__category-Technical"));
			fireEvent.click(getByTestId("NetworkOption__ARK"));
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "test query",
				},
			});
		});

		act(() => {
			fireEvent.keyDown(getByTestId("NewsOptions__search"), { key: "Escape", code: 27 });
		});

		expect(onSubmit).not.toHaveBeenCalled();

		act(() => {
			fireEvent.keyDown(getByTestId("NewsOptions__search"), { key: "Enter", code: 13 });
		});

		expect(onSearch).toBeCalledWith("test query");
		expect(onSubmit).toBeCalledWith({
			categories: expect.arrayContaining(["Technical"]),
			coins: expect.arrayContaining(["ARK"]),
			searchQuery: expect.stringMatching("test query"),
		});
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

		const arkOption = getByTestId("NetworkOption__ARK");
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
			fireEvent.click(getByTestId("NetworkOption__ARK"));
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
			coins: expect.arrayContaining(["ARK"]),
			searchQuery: expect.stringMatching("test query"),
		});
	});

	it("should handle multiple selections", () => {
		const onSubmit = jest.fn();

		const { getByTestId } = render(
			<NewsOptions selectedCategories={categories} selectedCoins={coins} onSubmit={onSubmit} />,
		);

		act(() => {
			fireEvent.click(getByTestId("NetworkOption__ETH"));
			fireEvent.click(getByTestId("NetworkOption__BTC"));
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		expect(onSubmit).toBeCalledWith({
			categories: ["Technical"],
			coins: ["ETH", "BTC"],
			searchQuery: "",
		});
	});
});
