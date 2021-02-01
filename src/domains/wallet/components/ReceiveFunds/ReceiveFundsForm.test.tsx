/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { fireEvent, render, waitFor } from "utils/testing-library";

import { ReceiveFundsForm } from "./";

describe("ReceiveFundsForm", () => {
	it("should render", async () => {
		const { result: form } = renderHook(() => useForm());

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network="ark.mainnet" />
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
					<ReceiveFundsForm network="ark.mainnet" />
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
					<ReceiveFundsForm network="ark.mainnet" />
				</Form>,
			);
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(""));

			fireEvent.input(getByTestId("ReceiveFundsForm__smartbridge"), { target: { value: "test" } });
			await waitFor(() => expect(form.current.getValues("smartbridge")).toBe("test"));
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue("test"));

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should show alert if smartbridge value is too long", async () => {
		const smartbridge = Array(256).fill("x").join("");
		const { result: form } = renderHook(() => useForm({ mode: "onChange", defaultValues: { smartbridge } }));

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network="ark.mainnet" />
				</Form>,
			);
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(smartbridge));

			fireEvent.input(getByTestId("ReceiveFundsForm__smartbridge"), { target: { value: smartbridge } });
			await waitFor(() => expect(form.current.getValues("smartbridge")).toBe(smartbridge));
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge")).toHaveValue(smartbridge));
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__smartbridge-warning")).toBeInTheDocument());

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should not show smartbridge if network is not ark", async () => {
		const smartbridge = Array(256).fill("x").join("");
		const { result: form } = renderHook(() => useForm({ mode: "onChange", defaultValues: { smartbridge } }));

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network="compedia.mainnet" />
				</Form>,
			);

			expect(() => getByTestId("ReceiveFundsForm__smartbridge")).toThrow();

			expect(asFragment()).toMatchSnapshot();
		});
	});
});
