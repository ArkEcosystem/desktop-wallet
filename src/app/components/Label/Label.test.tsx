import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Label } from "./";

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
		const { container } = render(<Label size="small" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Label size="large" />);

		expect(container).toMatchSnapshot();
	});
});
