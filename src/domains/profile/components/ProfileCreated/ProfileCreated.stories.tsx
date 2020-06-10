import React from "react";
import { boolean } from "@storybook/addon-knobs";
import { ProfileCreated } from "./";

export default { title: "Profile / Components / Profile Created" };

export const Default = () => (
	<ProfileCreated
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("skip")}
		onSend={() => alert("start")}
	/>
);
