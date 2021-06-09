import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useHistory } from "react-router-dom";

import { useProfileUtils } from "./use-profile-utils";

export const useTimeFormat = () => {
	const { env } = useEnvironmentContext();
	const { getProfileFromUrl } = useProfileUtils(env);
	const history = useHistory();

	const defaultFormat = "DD.MM.YYYY HH:mm";

	const profile = getProfileFromUrl(history?.location.pathname);

	if (!profile) {
		return defaultFormat;
	}

	const timeFormat = profile.settings().get<string>(Contracts.ProfileSetting.TimeFormat);

	return timeFormat ? defaultFormat.replace("HH:mm", timeFormat) : defaultFormat;
};
