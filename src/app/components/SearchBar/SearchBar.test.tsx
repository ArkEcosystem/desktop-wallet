/* eslint-disable @typescript-eslint/require-await */
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<SearchBar />);

		expect(getByTestId("SearchBar")).toHaveTextContent(translations.SEARCH_BAR.FIND_IT);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onSearch callback on button click", async () => {
		const onSearch = jest.fn();

		const { getByTestId } = render(<SearchBar onSearch={onSearch} />);

		fireEvent.change(getByTestId("Input"), {
			target: {
				value: "test query",
			},
		});

		await act(async () => {
			fireEvent.click(getByTestId("SearchBar__button"));
		});

		expect(onSearch).toHaveBeenCalledWith("test query");
	});
});
