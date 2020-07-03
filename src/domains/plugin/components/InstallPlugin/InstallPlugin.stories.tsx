import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { InstallPlugin } from "./InstallPlugin";

export default { title: "Domains / Plugin / Components / InstallPlugin" };

export const Default = () => (
	<InstallPlugin
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
	/>
);
