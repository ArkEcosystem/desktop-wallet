import React from "react";
import { render } from "testing-library";

import { Label } from "./Label";

describe("Label", () => {
	it("should render", () => {
		const { container } = render(<Label />);

		expect(container).toMatchSnapshot();
	});

	it("should render primary color", () => {
		const { container } = render(<Label color="primary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render success color", () => {
		const { container } = render(<Label color="success" />);

		expect(container).toMatchSnapshot();
	});

	it("should render danger color", () => {
		const { container } = render(<Label color="danger" />);

		expect(container).toMatchSnapshot();
	});

	it("should render warning color", () => {
		const { container } = render(<Label color="warning" />);

		expect(container).toMatchSnapshot();
	});

	it("should render neutral color", () => {
		const { container } = render(<Label color="neutral" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { container } = render(<Label size="sm" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Label size="lg" />);

		expect(container).toMatchSnapshot();
	});
});
