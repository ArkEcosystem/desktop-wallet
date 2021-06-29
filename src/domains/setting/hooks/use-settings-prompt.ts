import { useCallback } from "react";
import { matchPath } from "react-router-dom";

export const useSettingsPrompt = ({ isDirty }: { isDirty: boolean }) => {
	const getPromptMessage = useCallback(
		(location: any) => {
			/* istanbul ignore next */
			const pathname = location.pathname || location.location?.pathname;

			const matchCurrent = matchPath(pathname, {
				path: "/profiles/:profileId/settings",
			});

			const isReload = matchCurrent !== null;

			if (isReload) {
				return true;
			}

			if (isDirty) {
				return "block";
			}

			return true;
		},
		[isDirty],
	);

	return { getPromptMessage };
};
