import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { matchPath } from "react-router-dom";
import { Middleware, MiddlewareParams } from "router/interfaces";
import { isIdle } from "utils/electron-utils";

type ActivityState = {
	intervalId?: ReturnType<typeof setInterval>;
	threshold?: number;
};

type CallbackFunction = () => void;

export class ProfileMiddleware implements Middleware {
	state: ActivityState = {};

	handler({ location, env, history }: MiddlewareParams) {
		const match = matchPath<{ profileId: string }>(location.pathname, {
			path: "/profiles/:profileId",
		});

		if (match) {
			const { profileId } = match.params;

			if (profileId === "create") {
				if (this.state.intervalId) {
					this.clearActivityState();
				}

				return true;
			}

			try {
				const profile = env.profiles().findById(profileId);
				const idleThreshold = (profile.settings().get(ProfileSetting.AutomaticSignOutPeriod) as number) * 60;

				if (this.state.intervalId === undefined || this.state.threshold !== idleThreshold) {
					this.setActivityState(
						() => {
							if (isIdle(idleThreshold)) {
								history.push("/");
							}
						},
						15 * 1000,
						idleThreshold,
					);
				}
			} catch {
				return false;
			}
		} else {
			if (this.state.intervalId) {
				this.clearActivityState();
			}
		}

		return true;
	}

	setActivityState(callback: CallbackFunction, interval: number, threshold: number) {
		const intervalId = setInterval(callback, interval);

		this.state = {
			intervalId,
			threshold,
		};
	}

	clearActivityState() {
		clearInterval(this.state.intervalId);

		this.state = {};
	}
}
