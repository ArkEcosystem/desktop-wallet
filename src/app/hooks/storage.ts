import { Storage } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
type State = Record<string, unknown>;
type Action =
	| { type: "init"; state: State }
	| { type: "set"; key: string; value: unknown }
	| { type: "forget"; key: string }
	| { type: "flush" };

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

export const useStore = (storage: Storage): [Storage, any] => {
	const [state, dispatch] = React.useReducer(reducer, {});

	React.useEffect(() => {
		console.log("state", state);
	}, [state]);

	const all = async () => state;
	const get = async <T>(key: string) => state[key] as T | undefined;
	const count = async () => Object.keys(state).length;
	const flush = async () => {
		await storage.flush();
		dispatch({ type: "init", state: {} });
	};
	const forget = async (key: string) => {
		await storage.forget(key);
		dispatch({ type: "set", key, value: undefined });
	};
	const set = async (key: string, value: any) => {
		console.log("set", key, value);
		await storage.set(key, value);
		dispatch({ type: "set", key, value });
	};
	const snapshot = () => storage.snapshot();
	const restore = () => storage.restore();

	const init = async () => {
		const data = await storage.all();
		console.log("init", data);
		dispatch({ type: "init", state: data });
	}

	return [{ all, get, count, set, flush, forget, snapshot, restore }, init];
};
