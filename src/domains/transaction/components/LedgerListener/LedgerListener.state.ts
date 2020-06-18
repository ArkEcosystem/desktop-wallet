import { LedgerDevice, LedgerDevicesState } from "./LedgerListener.models";

export const initialState: LedgerDevicesState = { currentDevice: undefined, devices: [] };

export const reducer = (state: LedgerDevicesState, action: { type: string; payload?: LedgerDevice }) => {
	if (action.type === "add") {
		if (!action.payload) {
			throw new Error(`The [add] action requires a payload.`);
		}

		state.devices = [...state.devices, action.payload].filter(
			(element: LedgerDevice, index: number, devices: LedgerDevice[]) =>
				devices.findIndex((device: LedgerDevice) => device.path === element.path) === index,
		);

		return { ...state, currentDevice: state.devices.length ? state.devices[state.devices.length - 1] : undefined };
	}

	if (action.type === "remove") {
		if (!action.payload) {
			throw new Error(`The [remove] action requires a payload.`);
		}

		return {
			...state,
			currentDevice:
				state.currentDevice && state.currentDevice.path === action.payload.path
					? undefined
					: state.currentDevice,
			devices: state.devices.filter((device) => device.path !== action.payload!.path),
		};
	}

	if (action.type === "reset") {
		return initialState;
	}

	throw new Error(`Received action of type [${action.type}] but failed to find a handler.`);
};
