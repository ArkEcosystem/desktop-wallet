import { fireEvent, render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { useForm } from "react-hook-form";

import { Form } from "./Form";

describe("Form", () => {
	it("should render with provider", async () => {
		const { result: form } = renderHook(() => useForm());
		const onSubmit = jest.fn();

		const tree = (
			<Form context={form.current} onSubmit={onSubmit}>
				<input name="name" ref={form.current.register()} defaultValue="test" />
			</Form>
		);

		const { getByTestId } = render(tree);

		// eslint-disable-next-line @typescript-eslint/require-await
		await act(async () => {
			fireEvent.submit(getByTestId("Form"));
		});

		expect(onSubmit).toHaveBeenCalledWith({ name: "test" }, expect.anything());
	});
});
