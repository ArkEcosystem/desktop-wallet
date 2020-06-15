import React from "react";

import { Welcome } from "./Welcome";

export default {
	title: "Profile / Pages / Welcome",
};

export const Default = () => (
	<div className="w-full h-full">
		<Welcome />
	</div>
);

export const WithProfiles = () => (
	<div className="w-full h-full">
		<Welcome />
	</div>
);
