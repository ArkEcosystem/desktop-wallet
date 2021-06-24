import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration } from "app/contexts";
import { isIdle } from "utils/electron-utils";

interface HandlerParameters {
	profile?: Contracts.IProfile;
	onTimeout?: CallbackFunction;
	reset?: boolean;
}

type CallbackFunction = () => void;

export const useAutomaticSignout = () => {
	const { activityState, setConfiguration } = useConfiguration();

	const setActivityState = (callback: CallbackFunction, interval: number, threshold: number) => {
		clearActivityState();

		const intervalId = +setInterval(callback, interval);

		setConfiguration({ activityState: { intervalId, threshold } });
	};

	const clearActivityState = () => {
		clearInterval(activityState.intervalId);
		setConfiguration({ activityState: {} });
	};

	const monitorIdleTime = ({ profile, onTimeout, reset }: HandlerParameters) => {
		if (!profile || !profile.status().isRestored()) {
			clearActivityState();
			return;
		}

		if (reset) {
			clearInterval(activityState.intervalId);
		}

		// Already counting
		if (activityState.intervalId && !reset) {
			return;
		}

		const idleThreshold =
			(profile.settings().get(Contracts.ProfileSetting.AutomaticSignOutPeriod, 1) as number) * 60;

		setActivityState(
			() => {
				if (!isIdle(idleThreshold)) {
					return;
				}

				onTimeout?.();
				clearActivityState();
			},
			5 * 1000,
			idleThreshold,
		);
	};

	return { monitorIdleTime, resetAutomaticSignout: clearActivityState };
};
