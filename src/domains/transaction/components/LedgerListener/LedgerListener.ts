// @ts-ignore - Could not find a declaration file for module '@ledgerhq/hw-transport-node-hid-singleton'.
import LedgerTransport from "@ledgerhq/hw-transport-node-hid-singleton";
import { useEffect, useReducer } from "react";
import { Observable } from "rxjs";

import { initialState, reducer } from "./LedgerListener.state";

export const LedgerListener = () => {
	const [, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		let subscription: { unsubscribe: Function };

		const syncDevices = () => {
			subscription = Observable.create(LedgerTransport.listen).subscribe(
				// Next
				({ device, deviceModel, type }: any) => {
					if (device) {
						dispatch({
							type,
							payload: {
								type: "hid",
								path: device.path,
								modelId: deviceModel ? deviceModel.id : "nanoS",
							},
						});
					}
				},
				// Error
				() => {
					dispatch({ type: "reset" });

					syncDevices();
				},
				// Completed
				() => {
					dispatch({ type: "reset" });

					syncDevices();
				},
			);
		};

		const timeoutSyncDevices = setTimeout(syncDevices, 1000);

		return () => {
			clearTimeout(timeoutSyncDevices);

			subscription.unsubscribe();
		};
	});

	return null;
};
