import React from "react";
import { render } from "testing-library";

import { Alert } from "./Alert";

describe("Alert", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Alert />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with title", () => {
		const { getByTestId } = render(<Alert title="Hello!" />);

		expect(getByTestId("alert__title")).toHaveTextContent("Hello!");
	});

	it("should render with children", () => {
		const { getByTestId } = render(<Alert title="Hello!">I am a children</Alert>);

		expect(getByTestId("alert__title")).toHaveTextContent("Hello!");
		expect(getByText("I am a children")).toBeTruthy();
	});

	it("should render a small one", () => {
		const { container } = render(<Alert size="sm" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Alert size="lg" />);

		expect(container).toMatchSnapshot();
	});
});
