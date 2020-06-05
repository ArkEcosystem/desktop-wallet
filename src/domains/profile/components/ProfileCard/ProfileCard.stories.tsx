import React from "react";
import { ProfileCard } from "./ProfileCard";
import { withKnobs, text } from "@storybook/addon-knobs";

export default { title: "Components / Profile Card", decorators: [withKnobs] };

export const Default = () => {
	const name = text("Profile name", "Oleg Gelo");
	const balance = text("Total Balance", "234,500.46 USD");
	const avatar = text("User Avatar", "https://www.w3schools.com/howto/img_avatar.png");

	return <ProfileCard name={name} balance={balance} avatar={avatar} />;
};
