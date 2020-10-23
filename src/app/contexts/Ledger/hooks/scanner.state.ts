import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { pull, sortBy, uniq, uniqBy } from "@arkecosystem/utils";

import { LedgerData } from "../utils";

type State = {
	page: number;
	selected: number[];
	loading: number[];
	wallets: LedgerData[];
	failed: number[];
};

type Action =
	| { type: "load"; payload: LedgerData[] }
	| { type: "success"; payload: LedgerData[] }
	| { type: "failed" }
	| { type: "selectAll" }
	| { type: "toggleSelect"; index: number }
	| { type: "toggleSelectAll" };

const indexMapper = (item: LedgerData) => item.index;

export const scannerReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "load":
			return {
				...state,
				loading: action.payload.map(indexMapper),
				wallets: uniqBy([...state.wallets, ...action.payload], indexMapper),
			};
		case "success": {
			const { wallets, loading } = state;
			const { payload } = action;

			const payloadIndexes = payload.map(indexMapper);

			let nextWallets = [];

			if (loading.length > payload.length) {
				const newWallets = wallets.filter((item) => !payloadIndexes.includes(item.index));

				for (const data of newWallets) {
					data.balance = BigNumber.ZERO;
					data.isNew = true;
				}

				nextWallets.push(...newWallets);
			}

			nextWallets = uniqBy([...nextWallets, ...payload, ...wallets], indexMapper);

			const nextSelected = uniq([...state.selected, ...payloadIndexes]);
			const nextFailed = pull(state.failed, ...nextWallets.map(indexMapper));

			return {
				...state,
				page: state.page + 1,
				wallets: sortBy(nextWallets, indexMapper),
				selected: nextSelected,
				failed: nextFailed,
				loading: [],
			};
		}
		case "toggleSelect": {
			let current = state.selected;
			const indexOf = state.selected.indexOf(action.index);

			if (indexOf >= 0) {
				current = current.splice(indexOf, 1);
			} else {
				current.push(action.index);
			}

			return { ...state, selected: [...current] };
		}
		case "toggleSelectAll": {
			const { selected, wallets } = state;

			if (!selected.length || wallets.length > selected.length) {
				return { ...state, selected: wallets.map(indexMapper) };
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
		default:
			throw new Error();
	}
};
