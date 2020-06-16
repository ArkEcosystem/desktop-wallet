import React, { useState, useEffect } from "react";
import { boolean } from "@storybook/addon-knobs";
import { InstallPlugin } from "./";

export default { title: "Plugins / Components / Install Plugin" };

export const Default = () => {
	return (
		<InstallPlugin
			isOpen={boolean("Is Open", true)}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
		/>
	);
};
