import React from "react";
import { render } from "testing-library";

import { Divider } from "./Divider";

describe("Divider", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Divider />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render horizontal type", () => {
		const { container } = render(<Divider type="horizontal" />);

		expect(container).toMatchSnapshot();
	});

	it("should render vertical type", () => {
		const { container } = render(<Divider type="vertical" />);

		expect(container).toMatchSnapshot();
	});

	it("should render vertical type and small", () => {
		const { container } = render(<Divider type="vertical" size="sm" />);

		expect(container).toMatchSnapshot();
	});

	it("should render vertical type and large", () => {
		const { container } = render(<Divider type="vertical" size="lg" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a dashed", () => {
		const { container } = render(<Divider dashed />);

		expect(container).toMatchSnapshot();
	});
});
