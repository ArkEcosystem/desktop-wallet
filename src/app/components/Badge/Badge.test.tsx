import React from "react";
import { render } from "testing-library";

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

	it.each(["top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"])(
		"should render with position '%s'",
		(position) => {
			const { container } = render(<Badge icon="settings" position={position} />);
			expect(container).toMatchSnapshot();
		},
	);

	it.each(["md", "lg"])("should render with size '%s'", (size) => {
		const { container } = render(<Badge icon="settings" size={size} />);
		expect(container).toMatchSnapshot();
	});
});
