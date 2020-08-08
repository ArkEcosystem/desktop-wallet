import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { ProfileCard } from "./ProfileCard";

export default { title: "Domains / Profile / Components / ProfileCard", decorators: [withKnobs] };

export const Default = () => {
	const profile = env.profiles().findById(getDefaultProfileId());
	const showSettings = boolean("showSettings", true);
	const actions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];

	return (
		<ProfileCard
			handleClick={() => console.log(profile)}
			profile={profile}
			actions={actions}
			showSettings={showSettings}
		/>
	);
};
