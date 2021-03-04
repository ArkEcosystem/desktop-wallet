import React from "react";
import { render } from "utils/testing-library";

import { ExchangeGrid } from "./ExchangeGrid";

describe("ExchangeGrid", () => {
	it("should render", () => {
		const { asFragment } = render(<ExchangeGrid exchanges={[]} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
