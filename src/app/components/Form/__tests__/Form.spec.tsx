import React from "react";
import { render } from "@testing-library/react";

import { Form, FormError } from "../";

describe("Form", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Form />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the error", () => {
		const { container, asFragment } = render(<FormError />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
