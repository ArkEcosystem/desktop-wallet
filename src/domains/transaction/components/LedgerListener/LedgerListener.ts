// @ts-ignore - Could not find a declaration file for module '@ledgerhq/hw-transport-node-hid-singleton'.
import LedgerTransport from "@ledgerhq/hw-transport-node-hid-singleton";
import { useEffect, useReducer } from "react";
import { Observable } from "rxjs";

import { initialState, reducer } from "./LedgerListener.state";

export const LedgerListener = () => {
	const [, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		let subscription: { unsubscribe: Function } | undefined;

		const syncDevices = () => {
			if (subscription) {
				subscription.unsubscribe();
			}

			subscription = Observable.create(LedgerTransport.listen).subscribe(
				// Next
				({ device, deviceModel, type }: any) => {
					console.log("Next");
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
				// @ts-ignore
				(e) => {
					console.log(e);
					dispatch({ type: "reset" });

					// syncDevices();
				},
				// Completed
				() => {
					dispatch({ type: "reset" });

					syncDevices();
				},
			);
		};

		const timeoutSyncDevices = setTimeout(syncDevices, 5000);

		return () => {
			clearTimeout(timeoutSyncDevices);

			if (subscription) {
				subscription.unsubscribe();
			}

			subscription = undefined;
		};
	}, []);

	return null;
};
