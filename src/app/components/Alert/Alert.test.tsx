import React from "react";
import { render } from "testing-library";

import { Alert } from "./Alert";

describe("Alert", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Alert />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["info", "success", "warning", "danger", "hint"])("should render as %s alert", (variant) => {
		const { container, asFragment } = render(<Alert variant={variant} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with title", () => {
		const { getByTestId } = render(<Alert title="Hello!" />);

		expect(getByTestId("Alert__title")).toHaveTextContent("Hello!");
	});

	it("should render with children", () => {
		const { getByTestId, getByText } = render(<Alert title="Hello!">I am a children</Alert>);

		expect(getByTestId("Alert__title")).toHaveTextContent("Hello!");
		expect(getByText("I am a children")).toBeTruthy();
	});
});
