import React from "react";
import { render } from "testing-library";

import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
	it("should render", () => {
		const { container, asFragment } = render(<ContactForm />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
