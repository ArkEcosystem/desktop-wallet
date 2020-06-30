import {  withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { RepositoryLink } from "./RepositoryLink";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / RepositoryModal / Components / RepositoryLink",
	decorators: [withKnobs],
};

export const Default = () => <RepositoryLink repository="Npm" url="http://github.com/robank" />;
