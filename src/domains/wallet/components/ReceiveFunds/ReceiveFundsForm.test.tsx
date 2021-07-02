/* eslint-disable @typescript-eslint/require-await */
import { Networks } from "@arkecosystem/platform-sdk";
import { act, renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, getDefaultWalletId, render, waitFor } from "utils/testing-library";

import { ReceiveFundsForm } from ".";

let network: Networks.Network;

describe("ReceiveFundsForm", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById(getDefaultWalletId());
		network = wallet.network();
	});

	it("should render", async () => {
		const { result: form } = renderHook(() => useForm());

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network={network} />
				</Form>,
			);

			await waitFor(() => expect(getByTestId("ReceiveFundsForm__amount")).toHaveValue(""));
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__memo")).toHaveValue(""));

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should emit amount onChange event", async () => {
		const { result: form } = renderHook(() => useForm({ mode: "onChange" }));

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network={network} />
				</Form>,
			);

			await waitFor(() => expect(getByTestId("ReceiveFundsForm__amount")).toHaveValue(""));

			fireEvent.input(getByTestId("ReceiveFundsForm__amount"), { target: { value: "10" } });

			await waitFor(() => expect(form.current.getValues("amount")).toBe("10"));

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should emit memo onChange event", async () => {
		const { result: form } = renderHook(() => useForm({ mode: "onChange" }));

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network={network} />
				</Form>,
			);
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__memo")).toHaveValue(""));

			fireEvent.input(getByTestId("ReceiveFundsForm__memo"), { target: { value: "test" } });
			await waitFor(() => expect(form.current.getValues("memo")).toBe("test"));
			await waitFor(() => expect(getByTestId("ReceiveFundsForm__memo")).toHaveValue("test"));

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should not show memo if is not supported by network", async () => {
		const memo = Array.from({ length: 256 }).fill("x").join("");
		const { result: form } = renderHook(() => useForm({ defaultValues: { memo }, mode: "onChange" }));

		const memoMock = jest.spyOn(network, "usesMemo").mockReturnValue(false);

		await act(async () => {
			const { asFragment, getByTestId } = render(
				<Form context={form.current} onSubmit={(_) => _}>
					<ReceiveFundsForm network={network} />
				</Form>,
			);

			expect(() => getByTestId("ReceiveFundsForm__memo")).toThrow();

			expect(asFragment()).toMatchSnapshot();
		});

		memoMock.mockRestore();
	});
});
