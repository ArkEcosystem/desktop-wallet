import React from "react";
import { render } from "test-utils";

import { Card } from "./Card";

describe("Card", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Card />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
