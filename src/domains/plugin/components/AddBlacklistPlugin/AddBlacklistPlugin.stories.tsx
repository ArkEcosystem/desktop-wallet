import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { plugins } from "../../data";
import { AddBlacklistPlugin } from "./AddBlacklistPlugin";

export default { title: "Domains / Plugin / Components / AddBlacklistPlugin" };

export const Default = () => (
	<AddBlacklistPlugin isOpen={boolean("Is Open", true)} plugins={plugins} onClose={() => alert("closed")} />
);
