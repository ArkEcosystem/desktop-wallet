import React from "react";
import { render } from "testing-library";

import { SelectCategory } from "./SelectCategory";

describe("SelectCategory", () => {
	it("should render", () => {
		const { container, asFragment } = render(<SelectCategory>#All</SelectCategory>);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
