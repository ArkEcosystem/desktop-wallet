import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration } from "app/contexts";
import { isIdle } from "utils/electron-utils";

interface HandlerParameters {
	profile: Contracts.IProfile;
	onTimeout: CallbackFunction;
}

type CallbackFunction = () => void;

export const useAutomaticSignout = () => {
	const { activityState, setConfiguration } = useConfiguration();

	const setActivityState = (onTimeout: CallbackFunction, threshold: number) => {
		clearActivityState();

		const callback = () => {
			if (!isIdle(threshold)) {
				return;
			}

			onTimeout();
			clearActivityState();
		};

		const intervalId = +setInterval(callback, 15 * 1000);

		setConfiguration({ activityState: { intervalId, onTimeout, threshold } });
	};

	const clearActivityState = () => {
		clearInterval(activityState.intervalId);
		setConfiguration({ activityState: {} });
	};

	const updateIdleTime = (profile: Contracts.IProfile) => {
		const idleThreshold =
			(profile.settings().get(Contracts.ProfileSetting.AutomaticSignOutPeriod, 1) as number) * 60;

		setActivityState(activityState.onTimeout, idleThreshold);
	};

	const monitorIdleTime = ({ profile, onTimeout }: HandlerParameters) => {
		if (!profile.status().isRestored()) {
			clearActivityState();
			return;
		}

		// Already counting
		if (activityState.intervalId) {
			return;
		}

		const idleThreshold =
			(profile.settings().get(Contracts.ProfileSetting.AutomaticSignOutPeriod, 1) as number) * 60;

		setActivityState(onTimeout, idleThreshold);
	};

	return { monitorIdleTime, resetAutomaticSignout: clearActivityState, updateIdleTime };
};
