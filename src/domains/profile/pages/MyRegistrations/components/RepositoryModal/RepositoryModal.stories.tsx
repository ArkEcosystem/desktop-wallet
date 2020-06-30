import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { RepositoryModal } from "./RepositoryModal";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / RepositoryModal",
	decorators: [withKnobs],
};

export const Default = () => <RepositoryModal isOpen={boolean("Is Open", true)} handleClose={() => alert("closed")} />;
