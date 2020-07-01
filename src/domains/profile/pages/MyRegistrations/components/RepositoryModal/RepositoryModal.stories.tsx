import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { RepositoryModal } from "./RepositoryModal";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / RepositoryModal",
	decorators: [withKnobs],
};

const repositories = [
	{
		provider: "GitHub",
		url: "http://gitlab.com/robank",
	},
	{
		provider: "GitLab",
		url: "http://gitlab.com/robank",
	},
	{
		provider: "BitBucket",
		url: "http://bitbucket.com/robank",
	},
	{
		provider: "Npm",
		url: "http://npmjs.com/robank",
	},
];

export const Default = () => (
	<RepositoryModal
		isOpen={boolean("Is Open", true)}
		handleClose={() => alert("closed")}
		repositories={repositories}
	/>
);
