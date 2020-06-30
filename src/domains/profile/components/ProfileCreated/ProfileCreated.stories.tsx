import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { ProfileCreated } from "./ProfileCreated";

export default { title: "Domains / Profile / Components / ProfileCreated" };

export const Default = () => (
	<ProfileCreated
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onSkip={() => alert("skipped")}
		onStart={() => alert("started")}
	/>
);
