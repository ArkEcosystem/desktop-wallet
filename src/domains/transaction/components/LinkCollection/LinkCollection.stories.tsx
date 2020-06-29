import React from "react";

import { LinkCollection } from "./LinkCollection";

export default { title: "Transactions / Components / Link Collection" };

const types = [
	{
		label: "Facebook",
		value: "facebook",
	},
	{
		label: "Twitter",
		value: "twitter",
	},
	{
		label: "Instagram",
		value: "instagram",
	},
];

const links = [
	{
		link: "test",
		type: "facebook",
	},
	{
		link: "test 2",
		type: "twitter",
	},
	{
		link: "test 3",
		type: "linkedin",
	},
	{
		link: "test 4",
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
		selectionTypes={["twitter"]}
		selectionTypeTitle="Primary"
	/>
);

export const Readonly = () => (
	<LinkCollection
		title="Social Media"
		description="Tell people more about yourself through social media"
		types={types}
		data={links}
		typeName="media"
		selectionTypes={["twitter"]}
		selectionTypeTitle="Primary"
		readonly
	/>
);
