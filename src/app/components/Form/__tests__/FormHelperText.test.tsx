import React from "react";
import { render } from "@testing-library/react";
import { FormHelperText } from "../FormHelperText";
import { FormFieldProvider } from "../useFormField";

describe("FormHelperText", () => {
	it("should render hint text", () => {
		const hintMessage = "Test Message";
		const errorMessage = "Error Message";
		const { queryByText } = render(<FormHelperText errorMessage={errorMessage}>{hintMessage}</FormHelperText>);
		expect(queryByText(hintMessage)).toBeTruthy();
	});

	it("should not show hint if is invalid", () => {
		const hintMessage = "Test Message";
		const { queryByText } = render(<FormHelperText isInvalid>{hintMessage}</FormHelperText>);
		expect(queryByText(hintMessage)).toBeNull();
	});

	it("should render error message", () => {
		const hintMessage = "Test Message";
		const errorMessage = "Error Message";
		const { queryByText } = render(
			<FormHelperText errorMessage={errorMessage} isInvalid>
				{hintMessage}
			</FormHelperText>,
		);
		expect(queryByText(errorMessage)).toBeTruthy();
	});

	it("should not render if nothing is provided", () => {
		const { asFragment } = render(<FormHelperText />);
		expect(asFragment()).toMatchInlineSnapshot("<DocumentFragment />");
	});

	it("should read data from context", () => {
		const context = {
			name: "test",
			isInvalid: true,
			errorMessage: "Error message from context",
		};
		const tree = (
			<FormFieldProvider value={context}>
				<FormHelperText />
			</FormFieldProvider>
		);
		const { queryByText } = render(tree);
		expect(queryByText(context.errorMessage)).toBeTruthy();
	});
});
