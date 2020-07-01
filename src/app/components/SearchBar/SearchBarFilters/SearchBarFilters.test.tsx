import React from "react";
import { render } from "test-utils";

import { SearchBarFilters } from "./SearchBarFilters";

describe("SearchBarFilters", () => {
	it("should render", () => {
		const networks = [
			{ name: "Ark", isSelected: true },
			{ name: "Ethereum", isSelected: true },
			{ name: "Bitcoin", isSelected: false },
		];

		const mockFunction = () => void 0;

		const { asFragment, getByTestId } = render(
			<SearchBarFilters networks={networks} onNetworkChange={mockFunction} onViewAllNetworks={mockFunction} />,
		);

		expect(getByTestId("SearchBarFilters")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
