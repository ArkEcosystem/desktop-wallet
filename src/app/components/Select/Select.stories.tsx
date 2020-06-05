import React from "react";
import { Select } from "./Select";

export default {
	title: "Components / Select",
};

export const Default = () => (
	<Select placeholder="Select option">
		<option value="option1">Option 1</option>
		<option value="option2">Option 2</option>
		<option value="option3">Option 3</option>
	</Select>
);
