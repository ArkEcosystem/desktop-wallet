interface State {
	device?: {
		path: string;
		id: string;
	};
	isConnected: boolean;
	isBusy: boolean;
	isWaiting: boolean;
	error?: any;
}

type Action =
	| { type: "add"; path: string; id: string }
	| { type: "remove" }
	| { type: "connected" }
	| { type: "busy" }
	| { type: "waiting" }
	| { type: "disconnected" }
	| { type: "failed"; message: string };

export const defaultConnectionState = { isBusy: false, isConnected: false, isWaiting: false };

export const connectionReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "add":
			return {
				...state,
				device: {
					id: action.id,
					path: action.path,
				},
			};
		case "remove":
			return {
				...state,
				device: undefined,
				isConnected: false,
			};
		case "connected":
			return {
				...state,
				isBusy: false,
				isConnected: true,
				isWaiting: false,
			};
		case "busy": {
			return {
				...state,
				isBusy: true,
				isWaiting: false,
			};
		}
		case "waiting": {
			return {
				...state,
				error: undefined,
				isBusy: false,
				isWaiting: true,
			};
		}
		case "disconnected": {
			return {
				...state,
				isBusy: false,
				isConnected: false,
				isWaiting: false,
			};
		}
		case "failed": {
			return {
				...state,
				error: action.message,
				isBusy: false,
				isWaiting: false,
			};
		}
		/* istanbul ignore next */
		default: {
			throw new Error();
		}
	}
};
