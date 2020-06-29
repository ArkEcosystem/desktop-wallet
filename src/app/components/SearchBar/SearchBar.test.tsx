/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBar />
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBar")).toHaveTextContent(translations.SEARCH.FIND_IT);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should call onSearch callback on button click", async () => {
		const onSearch = jest.fn();

		const { getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBar onSearch={onSearch} />
			</I18nextProvider>,
		);

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
