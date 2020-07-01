import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { ProfileCard } from "./ProfileCard";

export default { title: "Domains / Profile / Components / ProfileCard", decorators: [withKnobs] };

export const Default = () => {
	const profile = {
		id: () => "fdda765f-fc57-5604-a269-52a7df8164ec",
		name: () => "Oleg Gelo",
		balance: () => "234,500.46 USD",
		avatar: () =>
			'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(33, 150, 243)" width="100" height="100"/><circle r="40" cx="60" cy="50" fill="rgb(255, 87, 34)"/><circle r="55" cx="80" cy="40" fill="rgb(205, 220, 57)"/><circle r="35" cx="50" cy="70" fill="rgb(255, 193, 7)"/></svg>',
	};

	const showSettings = boolean("showSettings", true);
	const actions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];

	return <ProfileCard profile={profile} actions={actions} showSettings={showSettings} />;
};
