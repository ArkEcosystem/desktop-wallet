import React from "react";
import { Checkbox } from "./Checkbox";

export default {
	title: "Basic / Checkbox",
};

export const Default = () => (
	<div className="inline-flex space-x-4">
		<Checkbox color="primary" checked />
		<Checkbox color="success" checked />
		<Checkbox color="danger" checked />
		<Checkbox color="warning" checked />
	</div>
);
