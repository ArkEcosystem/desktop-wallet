import { render } from "@testing-library/react";
import React from "react";

import { Card } from "./";

describe("Card", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Card />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
