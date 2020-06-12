import React from "react";
import { number, text, withKnobs } from "@storybook/addon-knobs";
import { CircleProgressBar } from "./CircleProgressBar";

export default {
	title: "Components / CircleProgressBar",
	decorators: [withKnobs],
};

export const Default = () => {
	const size = number("Size", 10);
	const trailStrokeWidth = number("Trail Width", 2);
	const trailStrokeColor = text("Trail Color", "#e2f0e6");
	const strokeWidth = number("Stroke Width", 2);
	const strokeColor = text("Stroke Color", "#289548");
	const percentageColor = text("Percentage Color", "#289548");

	return (
		<CircleProgressBar
			percentage={100}
			size={size}
			trailStrokeWidth={trailStrokeWidth}
			trailStrokeColor={trailStrokeColor}
			strokeWidth={strokeWidth}
			strokeColor={strokeColor}
			percentageColor={percentageColor}
		/>
	);
};
