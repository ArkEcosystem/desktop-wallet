import Transport from "@ledgerhq/hw-transport";
import { useCallback, useEffect, useState } from "react";

import { LedgerDevice } from "./LedgerListener.models";

type Props = {
	transport: typeof Transport;
	onDevice?: (device: LedgerDevice | undefined) => void;
	onError?: () => void;
	onComplete?: () => void;
};

export const LedgerListener = ({ transport, onDevice, onError, onComplete }: Props) => {
	const [device, setDevice] = useState<LedgerDevice | undefined>();

	const syncDevices = useCallback(
		() =>
			transport.listen({
				next: ({
					// @ts-ignore
					deviceModel,
					descriptor,
					type,
				}) => {
					const modelId = deviceModel?.id || "nanoS";
					if (type === "add") {
						setDevice({ path: descriptor, modelId });
						return;
					}
					setDevice(undefined);
				},
				error: onError!,
				complete: onComplete!,
			}),
		[transport, onError, onComplete],
	);

	useEffect(() => {
		const subscription = syncDevices();
		return () => {
			subscription?.unsubscribe?.();
		};
	}, [syncDevices]);

	useEffect(() => {
		onDevice?.(device);
	}, [device, onDevice]);

	return null;
};

/* istanbul ignore next */
LedgerListener.defaultProps = {
	onError: () => void 0,
	onComplete: () => void 0,
};
