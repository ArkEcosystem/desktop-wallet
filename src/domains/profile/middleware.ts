import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { matchPath } from "react-router-dom";
import { Middleware, MiddlewareParams } from "router/interfaces";
import { Theme } from "types";
import { isIdle, setScreenshotProtection, setThemeSource, shouldUseDarkColors } from "utils/electron-utils";

type ActivityState = {
	intervalId?: ReturnType<typeof setInterval>;
	threshold?: number;
};

type CallbackFunction = () => void;

export class ProfileMiddleware implements Middleware {
	state: ActivityState = {};

	handler({ location, env, history }: MiddlewareParams) {
		const theme = shouldUseDarkColors() ? "dark" : "light";

		const match = matchPath<{ profileId: string }>(location.pathname, {
			path: "/profiles/:profileId",
		});

		const setTheme = (theme: Theme) => {
			setThemeSource(theme);

			document.body.classList.remove(`theme-${shouldUseDarkColors() ? "light" : "dark"}`);
			document.body.classList.add(`theme-${shouldUseDarkColors() ? "dark" : "light"}`);
		};

		if (match) {
			const { profileId } = match.params;

			if (profileId === "create") {
				if (this.state.intervalId) {
					this.clearActivityState();
				}

				setScreenshotProtection(true);

				return true;
			}

			try {
				const profile = env.profiles().findById(profileId);

				const profileTheme = profile.settings().get<Theme>(ProfileSetting.Theme)!;

				/* istanbul ignore else */
				if (
					shouldUseDarkColors() !== (profileTheme === "dark") ||
					!document.body.classList.contains(`theme-${theme}`)
				) {
					setTheme(profileTheme);
				}

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

				setScreenshotProtection(profile.settings().get(ProfileSetting.ScreenshotProtection) === true);
			} catch {
				return false;
			}
		} else {
			setTheme("system");

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
