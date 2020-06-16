import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import { SearchBarOptions } from "domains/search/components/SearchBarOptions";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { translations } from "../../i18n";
import { SearchBar } from "./";

describe("SearchBar", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBar />
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBar")).toHaveTextContent(translations.FIND_IT);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with options", () => {
		const options = [{ label: "TESTING LABEL", value: "test" }];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBar extra={<SearchBarOptions options={options} onSelect={() => void 0} />} />
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBar")).toHaveTextContent(translations.FIND_IT);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with selected option", () => {
		const options = [{ label: "TESTING LABEL", value: "test" }];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBar
					extra={<SearchBarOptions selectedOption={options[0]} options={options} onSelect={() => void 0} />}
				/>
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBar")).toHaveTextContent(translations.FIND_IT);
		expect(asFragment()).toMatchSnapshot();
	});
});
