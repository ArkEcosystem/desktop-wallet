import React from "react";
import { Welcome } from "./Welcome";

export default {
	title: "Profile / Pages / Welcome",
};

const profiles = [
	{
		id: 1,
		name: "Oleg Gelo",
		balance: "234,500.46 USD",
		avatar: "https://www.w3schools.com/howto/img_avatar.png",
	},
];

export const Default = () => (
	<div className="w-full h-full">
		<Welcome profiles={[]} />
	</div>
);

export const WithProfiles = () => (
	<div className="w-full h-full">
		<Welcome profiles={profiles} />
	</div>
);
