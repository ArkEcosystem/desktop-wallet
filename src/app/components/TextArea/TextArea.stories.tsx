import React from "react";

import { TextArea } from "./TextArea";

export default { title: "App / Components / TextArea" };

export const Default = () => {
	return (
		<div className="max-w-xs space-y-4">
			<TextArea placeholder="Enabled" />
			<TextArea placeholder="Invalid" isInvalid />
			<TextArea placeholder="Disabled" disabled />
		</div>
	);
};
