import React from "react";
import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import { ProfileCard } from "./ProfileCard";

export default { title: "Profile / Components / Profile Card", decorators: [withKnobs] };

export const Default = () => {
	const name = text("Profile name", "Oleg Gelo");
	const balance = text("Total Balance", "234,500.46 USD");
	const avatar = text("User Avatar", "https://www.w3schools.com/howto/img_avatar.png");
	const showSettings = boolean("showSettings", true);
	const actions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];

	return <ProfileCard name={name} balance={balance} avatar={avatar} actions={actions} showSettings={showSettings} />;
};
