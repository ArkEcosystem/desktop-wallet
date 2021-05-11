import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration } from "app/contexts";
import { useCallback, useEffect, useState } from "react";

export const useTutorial = (profile: Contracts.IProfile) => {
	const [showTutorial, setShowTutorial] = useState(false);
	const { profileIsSyncing } = useConfiguration();

	useEffect(() => {
		if (profileIsSyncing) {
			return;
		}

		setShowTutorial(!profile.hasCompletedIntroductoryTutorial());
	}, [profile, profileIsSyncing]);

	const startTutorial = () => undefined;

	const skipTutorial = useCallback(() => {
		profile.markIntroductoryTutorialAsComplete();
		setShowTutorial(false);
	}, [profile]);

	return {
		showTutorial,
		startTutorial,
		skipTutorial,
	};
};
