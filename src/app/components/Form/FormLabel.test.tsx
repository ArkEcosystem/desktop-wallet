import "@testing-library/jest-dom/extend-expect";

import React from "react";
import { act, fireEvent, render } from "testing-library";

import { FormLabel } from "./FormLabel";
import { FormFieldProvider } from "./useFormField";

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
		const { queryByTestId, asFragment } = render(tree);
		expect(queryByTestId("FormLabel")).toHaveAttribute("for", context.name);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render & hover if required", () => {
		const { asFragment, baseElement, getByTestId } = render(<FormLabel label="Test" required />);

		expect(getByTestId("FormLabel__required")).toBeTruthy();

		act(() => {
			fireEvent.mouseEnter(getByTestId("FormLabel__required"));
		});

		expect(baseElement).toHaveTextContent("This field is required");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render & hover if optional", () => {
		const { asFragment, baseElement, getByTestId } = render(<FormLabel label="Test" optional />);

		expect(getByTestId("FormLabel__required")).toBeTruthy();

		act(() => {
			fireEvent.mouseEnter(getByTestId("FormLabel__optional"));
		});

		expect(baseElement).toHaveTextContent("This field is optional");
		expect(asFragment()).toMatchSnapshot();
	});
});
