import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { SearchBarOptions } from "./SearchBarOptions";

describe("SearchBarOptions", () => {
	it("should render", () => {
		const options = [{ label: "TESTING LABEL", value: "test" }];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBarOptions options={options} onSelect={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBarOptions")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with selected option", () => {
		const options = [{ label: "TESTING LABEL", value: "test" }];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBarOptions selectedOption={options[0]} options={options} onSelect={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBarOptions")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
