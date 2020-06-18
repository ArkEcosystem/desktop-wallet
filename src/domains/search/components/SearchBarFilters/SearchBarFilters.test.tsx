import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { SearchBarFilters } from "./SearchBarFilters";

describe("SearchBarFilters", () => {
	it("should render", () => {
		const networks = [
			{ name: "Ark", isSelected: true },
			{ name: "Eth", isSelected: true },
			{ name: "Btc", isSelected: false },
		];

		const mockFunction = () => void 0;

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<SearchBarFilters networks={networks} onNetworkChange={mockFunction} onViewAllNetworks={mockFunction} />
			</I18nextProvider>,
		);

		expect(getByTestId("SearchBarFilters")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
