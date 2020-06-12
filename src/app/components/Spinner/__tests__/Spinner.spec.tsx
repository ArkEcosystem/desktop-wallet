import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Spinner } from "../Spinner";

describe("Spinner", () => {
	it("should render", () => {
		const { container } = render(<Spinner />);

		expect(container).toMatchSnapshot();
	});

	it("should render a primary color", () => {
		const { container } = render(<Spinner color="primary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a success color", () => {
		const { container } = render(<Spinner color="success" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a danger color", () => {
		const { container } = render(<Spinner color="danger" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a warning color", () => {
		const { container } = render(<Spinner color="warning" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { container } = render(<Spinner size="small" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Spinner size="large" />);

		expect(container).toMatchSnapshot();
	});
});
