import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { matchPath } from "react-router-dom";
import { Middleware, MiddlewareParams } from "router/interfaces";
import { isIdle } from "utils/electron-utils";

type ActivityState = {
	idleInterval?: ReturnType<typeof setInterval>;
	hasTimer?: boolean;
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
				if (this.state.hasTimer) {
					this.clearIdleInterval();
				}

				return true;
			}

			try {
				const profile = env.profiles().findById(profileId);

				if (!this.state.hasTimer) {
					const idleThreshold = (profile.settings().get(ProfileSetting.AutomaticLogoffPeriod) as number) * 60;

					this.setIdleInterval(() => {
						if (isIdle(idleThreshold)) {
							history.push("/");
						}
					}, 15 * 1000);
				}
			} catch {
				return false;
			}
		} else {
			if (this.state.hasTimer) {
				this.clearIdleInterval();
			}
		}

		return true;
	}

	setIdleInterval(callback: CallbackFunction, interval: number) {
		this.state = {
			idleInterval: setInterval(callback, interval),
			hasTimer: true,
		};
	}

	clearIdleInterval() {
		clearInterval(this.state.idleInterval);

		this.state = {
			hasTimer: false,
		};
	}
}
