import React from "react";

import { StepIndicator } from "./StepIndicator";

export default { title: "Navigation / Step Indicator" };

export const Default = () => (
	<div className="space-y-5">
		<StepIndicator />
		<StepIndicator size={5} activeIndex={3} />
	</div>
);
