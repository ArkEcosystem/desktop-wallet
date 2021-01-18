import React from "react";
import { render } from "testing-library";

import { RadioButton } from "./RadioButton";

describe("RadioButton", () => {
	it("should render", () => {
		const { container } = render(<RadioButton />);

		expect(container).toMatchSnapshot();
	});

	it.each(["info", "success", "warning", "danger", "hint"])("should render a %s color", (color) => {
		const { container } = render(<RadioButton color={color} />);

		expect(container).toMatchSnapshot();
	});
});
