import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback, useEffect, useState } from "react";

export const useTutorial = (profile: Contracts.IProfile) => {
	const [showTutorial, setShowTutorial] = useState(false);

	useEffect(() => {
		setShowTutorial(!profile.hasCompletedTutorial());
	}, [profile]);

	const startTutorial = () => undefined;

	const skipTutorial = useCallback(() => {
		profile.data().set(Contracts.ProfileData.HasCompletedTutorial, true);
		setShowTutorial(false);
	}, [profile]);

	return {
		showTutorial,
		startTutorial,
		skipTutorial,
	};
};
