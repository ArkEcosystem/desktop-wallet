import React from "react";
import { Select } from "./Select";

export default {
	title: "Input / Select",
};

export const Default = () => (
	<div className="space-y-4 max-w-xs">
		<Select placeholder="Select option">
			<option value="option1">Option 1</option>
			<option value="option2">Option 2</option>
			<option value="option3">Option 3</option>
		</Select>

		<Select placeholder="Invalid" isInvalid>
			<option value="option1">Option 1</option>
			<option value="option2">Option 2</option>
			<option value="option3">Option 3</option>
		</Select>

		<Select placeholder="Disabled" disabled />
	</div>
);
