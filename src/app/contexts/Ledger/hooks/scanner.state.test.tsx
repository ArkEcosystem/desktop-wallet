import { act, renderHook } from "@testing-library/react-hooks";
import { useReducer } from "react";
import { waitFor } from "utils/testing-library";

import { scannerReducer } from "./scanner.state";

describe("Scanner State", () => {
	it("should dispatch toggleSelect with selected", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				selected: [`44'/1'/1'/0/0`],
				wallets: [
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				path: `44'/1'/1'/0/0`,
				type: "toggleSelect",
			});
		});

		await waitFor(() => expect(result.current[0].selected).toEqual([]));
	});

	it("should dispatch toggleSelect without selected", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				selected: [],
				wallets: [
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				path: `44'/1'/1'/0/0`,
				type: "toggleSelect",
			});
		});

		await waitFor(() => expect(result.current[0].selected).toEqual([`44'/1'/1'/0/0`]));
	});

	it("should dispatch toggleSelectAll with selected length and wallets length", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				selected: [`44'/1'/1'/0/0`],
				wallets: [
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/2'/0/0`,
					},
				],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "toggleSelectAll",
			});
		});

		await waitFor(() => expect(result.current[0].selected).toEqual([`44'/1'/0'/0/0`, `44'/1'/2'/0/0`]));
	});

	it("should dispatch toggleSelectAll without selected", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				selected: [],
				wallets: [
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "toggleSelectAll",
			});
		});

		await waitFor(() => expect(result.current[0].selected).toEqual([`44'/1'/0'/0/0`]));
	});

	it("should dispatch failed", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				selected: [`44'/1'/1'/0/0`],
				wallets: [
					{
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				error: "Failed",
				type: "failed",
			});
		});

		await waitFor(() => expect(result.current[0].error).toEqual("Failed"));
	});
});
