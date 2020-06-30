import React from "react";

import { SelectionBar, SelectionBarOption } from "./SelectionBar";
import { useSelectionState } from "./useSelectionState";

export default { title: "App / Components / SelectionBar" };

export const Default = () => {
	const state = useSelectionState(1);

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
