import { act, renderHook } from "@testing-library/react-hooks";
import { useReducer } from "react";
import { waitFor } from "utils/testing-library";

import { scannerReducer } from "./scanner.state";

describe("Scanner State", () => {
	it("should go to next derivation if found a new wallet", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "success",
				payload: [{ address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", index: 1, path: `44'/1'/1'/0/0` }],
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(1));
		await waitFor(() => expect(result.current[0].page).toBe(0));
		await waitFor(() => expect(result.current[0].loading).toEqual([]));
	});

	it("should not change the index derivation if there are no custom derivations", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: [],
				currentDerivationModeIndex: 0,
				page: 0,
				selected: [],
				loading: [`44'/1'/1'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "success",
				payload: [{ address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", index: 1, path: `44'/1'/1'/0/0` }],
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toEqual([]));
	});

	it("should dispatch toggleSelect with selected", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [`44'/1'/1'/0/0`],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "toggleSelect",
				path: `44'/1'/1'/0/0`,
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(2));
	});

	it("should dispatch toggleSelect without selected", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "toggleSelect",
				path: `44'/1'/1'/0/0`,
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(2));
	});

	it("should dispatch toggleSelectAll with selected length and wallets length", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [`44'/1'/1'/0/0`],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
					{
						index: 1,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/2'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "toggleSelectAll",
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(2));
	});

	it("should dispatch toggleSelectAll without selected", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [`44'/1'/1'/0/0`],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "toggleSelectAll",
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(2));
	});

	it("should dispatch failed", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [`44'/1'/1'/0/0`],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "failed",
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(0));
	});

	it("should dispatch load", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [`44'/1'/1'/0/0`],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "load",
				payload: [{ address: "DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", index: 1, path: `44'/1'/1'/0/0` }],
				derivationModes: ["legacy", "bip44"],
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(1));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(1));
	});

	it("should dispatch next", async () => {
		const { result } = renderHook(() =>
			useReducer(scannerReducer, {
				derivationModes: ["legacy", "bip44"],
				currentDerivationModeIndex: 0,
				page: 1,
				selected: [`44'/1'/1'/0/0`],
				loading: [`44'/1'/1'/0/0`, `44'/1'/2'/0/0`],
				wallets: [
					{
						index: 0,
						address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
						path: `44'/1'/0'/0/0`,
					},
				],
				failed: [],
			}),
		);
		const [, dispatch] = result.current;

		act(() => {
			dispatch({
				type: "next",
			});
		});

		await waitFor(() => expect(result.current[0].currentDerivationModeIndex).toBe(0));
		await waitFor(() => expect(result.current[0].page).toBe(2));
		await waitFor(() => expect(result.current[0].loading).toHaveLength(0));
	});
});
