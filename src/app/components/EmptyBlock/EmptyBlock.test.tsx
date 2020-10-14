import React from "react";
import { render } from "testing-library";

import { EmptyBlock } from "./EmptyBlock";

describe("EmptyBlock", () => {
	it("should render", () => {
		const { container, asFragment } = render(<EmptyBlock message="Empty Message" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
