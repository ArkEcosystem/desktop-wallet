import React from "react";
import { Textarea } from "./Textarea";

export default { title: "Input / Textarea" };

export const Default = () => {
	return (
		<div className="space-y-4 max-w-xs">
			<Textarea placeholder="Enabled" />
			<Textarea placeholder="Invalid" isInvalid />
			<Textarea placeholder="Disabled" disabled />
		</div>
	);
};
