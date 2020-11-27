/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { fireEvent, render, waitFor } from "utils/testing-library";

import { ReceiveFundsForm } from "./";

const maxLength = 255;

describe("ReceiveFundsForm", () => {
	it("should render", async () => {
		const { result: form } = renderHook(() => useForm());

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm maxLength={maxLength} />
				</Form>,
			);

			await waitFor(() => expect(getByTestId("ReceiveFundsForm__amount")).toHaveValue(""));
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(""));
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should emit amount onChange event", async () => {
		const { result: form } = renderHook(() => useForm({ mode: "onChange" }));

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm maxLength={maxLength} />
				</Form>,
			);

			await waitFor(() => expect(getByTestId("ReceiveFundsForm__amount")).toHaveValue(""));

			fireEvent.input(getByTestId("ReceiveFundsForm__amount"), { target: { value: "10" } });

			await waitFor(() => expect(form.current.getValues("amount")).toBe("10"));

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should emit smartbridge onChange event", async () => {
		const { result: form } = renderHook(() => useForm({ mode: "onChange" }));

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm maxLength={maxLength} />
				</Form>,
			);
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(""));

			fireEvent.input(getByTestId("ReceiveFundsForm__smartbridge"), { target: { value: "test" } });

			await waitFor(() => expect(form.current.getValues("smartbridge")).toBe("test"));

			expect(asFragment()).toMatchSnapshot();
		});
	});
});
