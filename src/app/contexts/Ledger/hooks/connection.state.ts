type State = {
	device?: {
		path: string;
		id: string;
	};
	isConnected: boolean;
	isBusy: boolean;
	isWaiting: boolean;
	error?: any;
};

type Action =
	| { type: "add"; path: string; id: string }
	| { type: "remove" }
	| { type: "connected" }
	| { type: "busy" }
	| { type: "waiting" }
	| { type: "disconnected" }
	| { type: "failed"; message: string };

export const defaultConnectionState = { isConnected: false, isBusy: false, isWaiting: false };

export const connectionReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "add":
			return {
				...state,
				device: {
					path: action.path,
					id: action.id,
				},
			};
		case "remove":
			return {
				...state,
				isConnected: false,
				device: undefined,
			};
		case "connected":
			return {
				...state,
				isConnected: true,
				isBusy: false,
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
				isConnected: false,
				isBusy: false,
				isWaiting: false,
			};
		}
		case "failed": {
			return {
				...state,
				isBusy: false,
				isWaiting: false,
				error: action.message,
			};
		}
		/* istanbul ignore next */
		default: {
			throw new Error();
		}
	}
};
