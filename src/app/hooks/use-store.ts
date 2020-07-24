/* eslint-disable @typescript-eslint/require-await */
import { Storage } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

export type State = Record<string, unknown>;

type Action = { type: "init"; state: State } | { type: "set"; key: string; value: unknown };

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case "init":
			return action.state;
		case "set":
			return { ...state, [action.key]: action.value };
		default:
			throw new Error();
	}
};

export const useStore = (storage: Storage): [Storage, State, boolean] => {
	const [state, dispatch] = React.useReducer(reducer, {});
	const [initialized, setInitialized] = React.useState(false);

	React.useEffect(() => {
		const load = async () => {
			const data = await storage.all();
			dispatch({ type: "init", state: data });
			setInitialized(true);
		};
		load();
	}, [storage]);

	const all = async () => await storage.all();

	const get = async <T>(key: string) => await storage.get<T>(key);

	const count = async () => await storage.count();

	const flush = async () => {
		await storage.flush();
		dispatch({ type: "init", state: {} });
	};

	const forget = async (key: string) => {
		await storage.forget(key);
		dispatch({ type: "set", key, value: undefined });
	};

	const set = async (key: string, value: any) => {
		await storage.set(key, value);
		dispatch({ type: "set", key, value });
	};

	const snapshot = () => storage.snapshot();

	const restore = () => storage.restore();

	return [{ all, get, count, set, flush, forget, snapshot, restore }, state, initialized];
};
