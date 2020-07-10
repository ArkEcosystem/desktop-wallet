import React from "react";
import { render } from "testing-library";

import { SearchBarOptions } from "./SearchBarOptions";

describe("SearchBarOptions", () => {
	it("should render", () => {
		const options = [{ label: "TESTING LABEL", value: "test" }];

		const { asFragment, getByTestId } = render(<SearchBarOptions options={options} onSelect={() => void 0} />);

		expect(getByTestId("SearchBarOptions")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with selected option", () => {
		const options = [{ label: "TESTING LABEL", value: "test" }];

		const { asFragment, getByTestId } = render(
			<SearchBarOptions selectedOption={options[0]} options={options} onSelect={() => void 0} />,
		);

		expect(getByTestId("SearchBarOptions")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
