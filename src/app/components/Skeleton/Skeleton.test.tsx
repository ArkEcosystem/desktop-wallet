import React from "react";
import { render } from "testing-library";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
	it("should render", () => {
		const { asFragment } = render(<Skeleton />);

		expect(asFragment()).toMatchSnapshot();
	});
});
