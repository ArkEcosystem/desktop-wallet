import { LedgerData } from "../utils";

interface State {
	error?: string;
	selected: string[];
	wallets: LedgerData[];
}

type Action =
	| { type: "success"; payload: LedgerData[] }
	| { type: "failed"; error: string }
	| { type: "selectAll" }
	| { type: "toggleSelect"; path: string }
	| { type: "toggleSelectAll" };

const pathMapper = (item: LedgerData) => item.path;

export const scannerReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "success": {
			return {
				...state,
				error: undefined,
				wallets: action.payload,
				selected: action.payload.map(pathMapper),
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
				error: action.error,
			};
		}
		/* istanbul ignore next */
		default:
			throw new Error();
	}
};
