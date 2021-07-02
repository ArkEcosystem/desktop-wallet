import { useCallback } from "react";
import { FieldNamesMarkedBoolean } from "react-hook-form";
import { matchPath } from "react-router-dom";

interface UseSettingsPromptInput<TFieldValues> {
	isDirty: boolean;
	dirtyFields: FieldNamesMarkedBoolean<TFieldValues>;
}

export const useSettingsPrompt = <TFieldValues>({ isDirty, dirtyFields }: UseSettingsPromptInput<TFieldValues>) => {
	const getPromptMessage = useCallback(
		(location: any) => {
			/* istanbul ignore next */
			const pathname = location.pathname || location.location?.pathname;

			const matchCurrent = matchPath(pathname, {
				exact: true,
				path: "/profiles/:profileId/settings",
				strict: true,
			});

			const isReload = matchCurrent !== null;

			if (isReload) {
				return true;
			}

			if (isDirty && Object.keys(dirtyFields).length > 0) {
				return "block";
			}

			return true;
		},
		[isDirty, dirtyFields],
	);

	return { getPromptMessage };
};
