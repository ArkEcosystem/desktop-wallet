import { render } from "@testing-library/react";
import React from "react";

import { Badge } from "./Badge";

describe("Badge", () => {
	it("should render", () => {
		const { container } = render(<Badge />);
		expect(container).toMatchSnapshot();
	});

	it("should render with icon", () => {
		const { container } = render(<Badge icon="settings" />);
		expect(container).toMatchSnapshot();
	});
});
