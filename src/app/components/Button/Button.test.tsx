import React from "react";
import { fireEvent, render } from "testing-library";

import { Button } from "./Button";

describe("Button", () => {
	it("should render", () => {
		const { container } = render(<Button />);

		expect(container).toMatchSnapshot();
	});

	it("should render as primary button", () => {
		const { container } = render(<Button variant="primary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render as secondary button", () => {
		const { container } = render(<Button variant="secondary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render as danger button", () => {
		const { container } = render(<Button variant="danger" />);

		expect(container).toMatchSnapshot();
	});

	it("should render as transparent button", () => {
		const { container } = render(<Button variant="transparent" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { container } = render(<Button size="sm" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Button size="lg" />);

		expect(container).toMatchSnapshot();
	});

	it("should render an icon", () => {
		const { container } = render(<Button size="icon" />);

		expect(container).toMatchSnapshot();
	});

	it("should render if disabled", () => {
		const { asFragment, getByText } = render(<Button disabled>Click</Button>);

		expect(getByText("Click")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit event on click", () => {
		const onClick = jest.fn();
		const { getByText } = render(<Button onClick={onClick}>Click Me</Button>);

		fireEvent.click(getByText("Click Me"));
		expect(onClick).toHaveBeenCalled();
	});
});
