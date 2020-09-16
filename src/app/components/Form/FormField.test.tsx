import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { render } from "testing-library";

import { FormField } from "./FormField";
import { FormFieldConsumer } from "./useFormField";

describe("FormField", () => {
	it("should render without FormProvider", () => {
		const tree = (
			<FormField name="test">
				<input data-testid="input" name="test" />
			</FormField>
		);
		const { queryByTestId } = render(tree);
		expect(queryByTestId("input")).toBeTruthy();
	});

	it("should provide field context", () => {
		const { result: form } = renderHook(() => useForm());

		const errorMessage = "Error message";

		act(() => {
			form.current.setError("test", { type: "fail", message: errorMessage });
		});

		const tree = (
			<FormProvider {...form.current}>
				<FormField name="test">
					<FormFieldConsumer>{(value) => <p>{value?.errorMessage}</p>}</FormFieldConsumer>
				</FormField>
			</FormProvider>
		);
		const { queryByText } = render(tree);
		expect(queryByText(errorMessage)).toBeTruthy();
	});
});
