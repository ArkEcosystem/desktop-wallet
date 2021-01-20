import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { pull, sortBy, uniq, uniqBy } from "@arkecosystem/utils";

import { LedgerData } from "../utils";

type State = {
	derivationModes: string[];
	currentDerivationModeIndex: number;
	page: number;
	selected: string[];
	loading: string[];
	wallets: LedgerData[];
	failed: string[];
};

type Action =
	| { type: "load"; payload: LedgerData[]; derivationModes: string[] }
	| { type: "next" }
	| { type: "success"; payload: LedgerData[] }
	| { type: "failed" }
	| { type: "selectAll" }
	| { type: "toggleSelect"; path: string }
	| { type: "toggleSelectAll" };

const pathMapper = (item: LedgerData) => item.path;

export const scannerReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "load":
			return {
				...state,
				derivationModes: action.derivationModes,
				loading: action.payload.map(pathMapper),
				wallets: uniqBy([...state.wallets, ...action.payload], pathMapper),
			};
		case "next":
			return {
				...state,
				page: state.page + 1,
				loading: [],
			};
		case "success": {
			const { wallets, loading } = state;
			const { payload } = action;

			const payloadIndexes = payload.map(pathMapper);

			let nextWallets = [];
			const hasNew = loading.length > payload.length;
			const hasMoreDerivationModes = state.derivationModes.length - 1 > state.currentDerivationModeIndex;

			/* istanbul ignore next */
			if (hasNew) {
				const loadingWallets = wallets.filter((item) => loading.includes(item.path));
				const newWallets = loadingWallets.filter((item) => !payloadIndexes.includes(item.path));

				for (const data of newWallets) {
					data.balance = BigNumber.ZERO;
					data.isNew = true;
				}

				nextWallets.push(...newWallets);
			}

			nextWallets = uniqBy([...nextWallets, ...payload, ...wallets], pathMapper);

			// Display only empty addresses from the last derivation
			if (hasMoreDerivationModes) {
				nextWallets = nextWallets.filter((item) => !item.isNew);
			}

			return {
				...state,
				currentDerivationModeIndex:
					hasNew && hasMoreDerivationModes
						? state.currentDerivationModeIndex + 1
						: state.currentDerivationModeIndex,
				page: hasNew && hasMoreDerivationModes ? 0 : state.page + 1,
				wallets: sortBy(nextWallets, [(item) => item.timestamp, (item) => item.index]),
				selected: uniq([...state.selected, ...payloadIndexes]),
				failed: pull(state.failed, ...nextWallets.map(pathMapper)),
				loading: [],
			};
		}
		case "toggleSelect": {
			const current = state.selected;
			const indexOf = state.selected.indexOf(action.path);

			if (indexOf >= 0) {
				current.splice(indexOf, 1);
			} else {
				current.push(action.path);
			}

			return { ...state, selected: [...current] };
		}
		case "toggleSelectAll": {
			const { selected, wallets } = state;

			if (!selected.length || wallets.length > selected.length) {
				return { ...state, selected: wallets.map(pathMapper) };
			}

			return { ...state, selected: [] };
		}
		case "failed": {
			return {
				...state,
				loading: [],
				failed: uniq([...state.failed, ...state.loading]),
			};
		}
		/* istanbul ignore next */
		default:
			throw new Error();
	}
};
