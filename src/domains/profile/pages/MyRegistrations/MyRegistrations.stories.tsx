import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { MyRegistrations } from "./MyRegistrations";

export default {
	title: "Profile / Pages / My Registrations",
	decorators: [withKnobs],
};

export const Default = () => {
	const isEmpty = boolean("Empty State?", false);

	const registrations = [
		{
			type: "business",
			registrations: [
				{
					agent: "OlEBank",
					businessName: "ARK Ecosystem",
					history: [],
					website: "",
					msq: true,
					repository: [],
				},
			],
		},
	];

	return <MyRegistrations registrations={isEmpty ? [] : registrations} />;
};
