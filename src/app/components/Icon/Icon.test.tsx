import React from "react";
import { render, screen } from "utils/testing-library";

import { Icon } from "./Icon";

describe("Icon", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Icon name="ARK" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render fallbackk", () => {
		const { asFragment } = render(<Icon name="unknown" fallback={<span>Not found</span>} />);

		expect(screen.getByText("Not found"));

		expect(asFragment()).toMatchSnapshot();
	});
});
