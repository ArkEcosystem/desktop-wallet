import { useActiveProfile } from "app/hooks";
import { GeneralSettingsForm } from "domains/setting/components/GeneralSettingsForm";
import React from "react";

export const General: React.FC = () => {
	const activeProfile = useActiveProfile();

	if (!activeProfile.status().isRestored()) {
		return <p>Loading</p>; // @TODO add skeleton
	}

	return <GeneralSettingsForm profile={activeProfile} />
};
