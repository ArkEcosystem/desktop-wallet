import React from "react";

import { SelectionBar, SelectionBarGroup } from "./SelectionBar";
import { useRadioState } from "./useRadioState";

export default { title: "Basic / Selection Bar" };

export const Default = () => {
	const state = useRadioState(1);

	return (
		<SelectionBarGroup>
			<SelectionBar value={1} {...state}>
				Last
			</SelectionBar>
			<SelectionBar value={2} {...state}>
				Min
			</SelectionBar>
			<SelectionBar value={3} {...state}>
				Average
			</SelectionBar>
		</SelectionBarGroup>
	);
};
