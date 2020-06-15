import React from "react";
import { RadioButtonGroup, RadioButton } from "./RadioButton";
import { useRadioState } from "./useRadioState";

export default { title: "Basic / RadioButton" };

export const Default = () => {
	const state = useRadioState(1);

	return (
		<RadioButtonGroup>
			<RadioButton value={1} {...state}>
				Last
			</RadioButton>
			<RadioButton value={2} {...state}>
				Min
			</RadioButton>
			<RadioButton value={3} {...state}>
				Average
			</RadioButton>
		</RadioButtonGroup>
	);
};
