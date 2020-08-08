import React from "react";
import { render } from "testing-library";

import { Loader } from "./Loader";

describe("Loader", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Loader />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render closed", () => {
		const { container, asFragment } = render(<Loader show={false} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
