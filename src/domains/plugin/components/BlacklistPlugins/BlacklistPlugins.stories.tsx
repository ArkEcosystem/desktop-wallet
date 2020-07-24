import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { plugins } from "../../data";
import { BlacklistPlugins } from "./BlacklistPlugins";

export default { title: "Domains / Plugin / Components / BlacklistPlugins" };

export const Default = () => (
	<BlacklistPlugins isOpen={boolean("Is Open", true)} plugins={plugins} onClose={() => alert("closed")} />
);
