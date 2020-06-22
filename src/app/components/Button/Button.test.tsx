import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { Button } from "./Button";

describe("Button", () => {
	it("should render", () => {
		const { container } = render(<Button />);

		expect(container).toMatchSnapshot();
	});

	it("should render contrast text if not primary", () => {
		const { container } = render(<Button color="danger" />);

		expect(container).toHaveStyle("color: var(--theme-color-danger-contrast);");
		expect(container).toMatchSnapshot();
	});

	it("should render white text if primary", () => {
		const { container } = render(<Button variant="solid" color="primary" />);

		expect(container).toHaveStyle("color: var(--theme-white);");
		expect(container).toMatchSnapshot();
	});

	it("should render as plain", () => {
		const { container } = render(<Button variant="plain" />);

		expect(container).toMatchSnapshot();
	});

	it("should render as outline", () => {
		const { container } = render(<Button variant="outline" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { container } = render(<Button size="small" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Button size="large" />);

		expect(container).toMatchSnapshot();
	});

	it("should render an icon", () => {
		const { container } = render(<Button size="icon" />);

		expect(container).toMatchSnapshot();
	});

	it("should render if disabled", () => {
		const { asFragment, getByText } = render(<Button disabled>Click</Button>);

		expect(getByText("Click")).toBeDisabled();
		expect(asFragment).toMatchSnapshot();
	});

	it("should emit event on click", () => {
		const onClick = jest.fn();
		const { getByText } = render(<Button onClick={onClick}>Click Me</Button>);

		fireEvent.click(getByText("Click Me"));
		expect(onClick).toHaveBeenCalled();
	});
});
