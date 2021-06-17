import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration } from "app/contexts";
import { useCallback, useEffect, useState } from "react";

export const useTutorial = (environment: Environment, profile: Contracts.IProfile) => {
	const [showTutorial, setShowTutorial] = useState(false);
	const { profileIsSyncing } = useConfiguration();

	useEffect(() => {
		if (profileIsSyncing) {
			return;
		}

		setShowTutorial(!profile.hasCompletedIntroductoryTutorial());
	}, [profile, profileIsSyncing]);

	/* istanbul ignore next */
	const startTutorial = () => undefined;

	const skipTutorial = useCallback(async () => {
		profile.markIntroductoryTutorialAsComplete();
		setShowTutorial(false);

		await environment.persist();
	}, [environment, profile]);

	return {
		showTutorial,
		startTutorial,
		skipTutorial,
	};
};
