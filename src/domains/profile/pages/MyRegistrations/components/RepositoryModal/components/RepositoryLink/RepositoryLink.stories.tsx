import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { RepositoryLink } from "./RepositoryLink";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / RepositoryModal / Components / RepositoryLink",
	decorators: [withKnobs],
};

export const Default = () => <RepositoryLink provider="GitLab" url="http://github.com/robank" />;
