import { EnvironmentProvider } from "app/contexts";
import React from "react";

import { CreateProfile } from "./CreateProfile";

export default {
	title: "Domains / Profile / Pages / CreateProfile",
};

export const Default = () => (
	<EnvironmentProvider>
		<div className="w-full h-full">
			<CreateProfile />
		</div>
	</EnvironmentProvider>
);
