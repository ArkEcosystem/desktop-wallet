import React from "react";

import { TextArea } from "./TextArea";

export default { title: "App / Components / TextArea" };

export const Default = () => (
	<div className="space-y-4 max-w-xs">
		<TextArea placeholder="Enabled" />
		<TextArea placeholder="Invalid" isInvalid />
		<TextArea placeholder="Disabled" disabled />
	</div>
);
