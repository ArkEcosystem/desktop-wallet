import React from "react";
import { render } from "@testing-library/react";

import Alert from "../Alert";

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
});
