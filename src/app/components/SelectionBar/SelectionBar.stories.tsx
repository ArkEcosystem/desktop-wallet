import React from "react";

import { SelectionBar,SelectionBarOption } from "./SelectionBar";
import { useRadioState } from "./useRadioState";

export default { title: "Basic / Selection Bar" };

export const Default = () => {
	const state = useRadioState(1);

	return (
		<SelectionBar>
			<SelectionBarOption value={1} {...state}>
				Last
			</SelectionBarOption>
			<SelectionBarOption value={2} {...state}>
				Min
			</SelectionBarOption>
			<SelectionBarOption value={3} {...state}>
				Average
			</SelectionBarOption>
		</SelectionBar>
	);
};
