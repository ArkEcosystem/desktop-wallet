import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useRef } from "react";
import { isIdle } from "utils/electron-utils";

type ActivityState = {
	intervalId?: number;
	threshold?: number;
};

type HandlerParams = {
	profile?: Contracts.IProfile;
	onTimeout?: CallbackFunction;
};

type CallbackFunction = () => void;

export const useAutomaticSignout = () => {
	const activityState = useRef<ActivityState>({});

	const setActivityState = (callback: CallbackFunction, interval: number, threshold: number) => {
		clearActivityState();

		const intervalId = +setInterval(callback, interval);
		activityState.current = { intervalId, threshold };
	};

	const clearActivityState = () => {
		clearInterval(activityState.current.intervalId);
		activityState.current = {};
	};

	const monitorIdleTime = ({ profile, onTimeout }: HandlerParams) => {
		if (!profile || !profile.status().isRestored()) {
			clearActivityState();
			return;
		}

		// Already counting
		if (activityState.current.intervalId) {
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
			15 * 1000,
			idleThreshold,
		);
	};

	return { monitorIdleTime, resetAutomatiSignout: clearActivityState };
};
