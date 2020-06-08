import React from "react";
import { render } from "@testing-library/react";
import { FormLabel } from "../FormLabel";
import { FormFieldProvider } from "../useFormField";
import "@testing-library/jest-dom/extend-expect";

describe("FormLabel", () => {
	it("should render from children", () => {
		const label = "Test Label";
		const { queryByText } = render(<FormLabel>{label}</FormLabel>);
		expect(queryByText(label)).toBeTruthy();
	});

	it("should render from prop", () => {
		const label = "Test Label";
		const { queryByText } = render(<FormLabel label={label} />);
		expect(queryByText(label)).toBeTruthy();
	});

	it("should render with name from context", () => {
		const label = "Test Label";
		const context = {
			name: "test",
			isInvalid: true,
			errorMessage: "Error message from context",
		};
		const tree = (
			<FormFieldProvider value={context}>
				<FormLabel label={label} />
			</FormFieldProvider>
		);
		const { queryByTestId } = render(tree);
		expect(queryByTestId("FormLabel")).toHaveAttribute("for", context.name);
	});
});
