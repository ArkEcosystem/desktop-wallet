import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Checkbox } from "../Checkbox";

describe("Checkbox", () => {
	it("should render", () => {
		const { container } = render(<Checkbox />);

		expect(container).toMatchSnapshot();
	});

	it("should render a primary color", () => {
		const { container } = render(<Checkbox color="primary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a success color", () => {
		const { container } = render(<Checkbox color="success" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a danger color", () => {
		const { container } = render(<Checkbox color="danger" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a warning color", () => {
		const { container } = render(<Checkbox color="warning" />);

		expect(container).toMatchSnapshot();
	});
});
