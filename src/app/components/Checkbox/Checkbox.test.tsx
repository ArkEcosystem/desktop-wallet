import React from "react";
import { render } from "testing-library";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
	beforeAll(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	afterAll(() => {
		console.error.mockRestore();
	});

	it("should render", () => {
		const { container } = render(<Checkbox />);

		expect(container).toMatchSnapshot();
	});

	it("should render thick variant", () => {
		const { container } = render(<Checkbox variant="thick" />);

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

	it("should render a hint color", () => {
		const { container } = render(<Checkbox color="hint" />);

		expect(container).toMatchSnapshot();
	});
});
