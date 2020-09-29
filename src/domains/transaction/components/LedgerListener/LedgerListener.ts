// @ts-ignore - Could not find a declaration file for module '@ledgerhq/hw-transport-node-hid-singleton'.
import LedgerTransport from "@ledgerhq/hw-transport-node-hid-singleton";
import { useEffect, useState } from "react";

import { LedgerDevice } from "./LedgerListener.models";

export const LedgerListener = () => {
	// eslint-disable-next-line
	const [_, setDevice] = useState<LedgerDevice | undefined>();

	useEffect(() => {
		const syncDevices = () => {
			LedgerTransport.listen({
				next: ({
					deviceModel,
					descriptor,
					type,
				}: {
					descriptor: string;
					type: string;
					deviceModel: { id?: string };
				}) => {
					console.log(`[Ledger] ${type}`, { descriptor, deviceModel, type });
					const modelId = deviceModel?.id || "nanoS";
					if (type === "add") {
						setDevice({ path: descriptor, modelId });
					}
					setDevice(undefined);
				},
			});
		};

		const timeoutRef = setTimeout(syncDevices, 100);
		return () => {
			clearTimeout(timeoutRef);
		};
	}, []);

	return null;
};
