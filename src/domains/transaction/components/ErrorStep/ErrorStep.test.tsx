import React from "react";
import { render } from "utils/testing-library";

import { ErrorStep } from "./";

describe("ErrorStep", () => {
	it("should render with default texts", () => {
		const { asFragment } = render(<ErrorStep />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom title and subtitle", () => {
		const { asFragment } = render(<ErrorStep title="Custom error title" subtitle="Custom error subtitle" />);

		expect(asFragment()).toMatchSnapshot();
	});
});
