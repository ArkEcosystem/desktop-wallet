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
});
