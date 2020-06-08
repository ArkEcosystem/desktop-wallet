import React from "react";
import { render } from "@testing-library/react";

import { Input } from "../";

describe("Input", () => {
	it("should render an input", () => {
		const { container, asFragment } = render(<Input />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an input with configured label", () => {
		const { asFragment, getByTestId } = render(<Input label="Hug me" />);

		expect(getByTestId("input__label")).toHaveTextContent("Hug me");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an input with configured inner slot", () => {
		const { asFragment, getByTestId } = render(<Input innerSlot={<span>Hug me inner slot</span>} />);

		expect(getByTestId("input__inner-slot")).toHaveTextContent("Hug me inner slot");
		expect(asFragment()).toMatchSnapshot();
	});
});
