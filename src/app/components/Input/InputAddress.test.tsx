import React from "react";
import { render } from "testing-library";

import { InputAddress } from "./InputAddress";

describe("InputAddress", () => {
	it("should render", () => {
		const { asFragment } = render(<InputAddress />);
		expect(asFragment()).toMatchSnapshot();
	});
});
