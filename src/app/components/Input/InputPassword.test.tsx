import { FormFieldProvider } from "app/components/Form/useFormField";
import React from "react";
import { fireEvent, render } from "testing-library";

import { InputPassword } from "./InputPassword";

describe("InputPassword", () => {
	it("should render as a password field", () => {
		const { asFragment, getByTestId } = render(<InputPassword />);
		const input = getByTestId("Input");
		expect(input).toHaveAttribute("type", "password");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle the input type", () => {
		const { getByTestId } = render(<InputPassword />);
		const input = getByTestId("Input");
		const toggle = getByTestId("InputPassword__toggle");
		fireEvent.click(toggle);
		expect(input).toHaveAttribute("type", "text");
		fireEvent.click(toggle);
		expect(input).toHaveAttribute("type", "password");
	});

	it("should render invalid", () => {
		const context = {
			name: "password",
			isInvalid: true,
			errorMessage: "this password is invalid",
		};

		const { asFragment } = render(
			<FormFieldProvider value={context}>
				<InputPassword />
			</FormFieldProvider>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
