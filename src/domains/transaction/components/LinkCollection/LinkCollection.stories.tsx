import React from "react";

import { LinkCollection } from "./LinkCollection";

export default { title: "Domains / Transaction / Components / LinkCollection" };

const types = [
	{
		label: "Facebook",
		value: "facebook",
		validate: () => true,
	},
	{
		label: "Twitter",
		value: "twitter",
		validate: () => true,
	},
	{
		label: "Instagram",
		value: "instagram",
		validate: () => true,
	},
];

const links = [
	{
		value: "test",
		type: "facebook",
	},
	{
		value: "test 2",
		type: "twitter",
	},
	{
		value: "test 3",
		type: "linkedin",
	},
	{
		value: "test 4",
		type: "twitter",
	},
];

export const Default = () => (
	<LinkCollection
		title="Social Media"
		description="Tell people more about yourself through social media"
		types={types}
		typeName="media"
	/>
);

export const WithSelection = () => (
	<LinkCollection
		title="Social Media"
		description="Tell people more about yourself through social media"
		types={types}
		data={links}
		typeName="media"
		selectionTypes={["facebook", "twitter"]}
		selectionTypeTitle="Primary"
	/>
);
