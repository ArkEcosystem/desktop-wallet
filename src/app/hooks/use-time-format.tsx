import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";
import { useMemo } from "react";
import { useHistory } from "react-router-dom";

import { useProfileUtils } from "./use-profile-utils";

export const useTimeFormat = () => {
	const { env } = useEnvironmentContext();
	const { getProfileFromUrl } = useProfileUtils(env);
	const history = useHistory();

	const defaultFormat = "DD.MM.YYYY h:mm A";

	const profile = getProfileFromUrl(history?.location.pathname);

	const result = useMemo(() => {
		if (!profile) {
			return defaultFormat;
		}

		const timeFormat = profile.settings().get<string | undefined>(Contracts.ProfileSetting.TimeFormat);

		if (timeFormat) {
			return defaultFormat.replace("h:mm A", timeFormat);
		}

		return defaultFormat;
	}, [profile]);

	return result;
};
