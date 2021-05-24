import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { setScreenshotProtection } from "utils/electron-utils";

export const useScreenshotProtection = () => {
	const setProfileScreenshotProtection = (profile: Contracts.IProfile) => {
		setScreenshotProtection(profile.settings().get(Contracts.ProfileSetting.ScreenshotProtection) === true);
	};

	return { setScreenshotProtection: setProfileScreenshotProtection };
};
