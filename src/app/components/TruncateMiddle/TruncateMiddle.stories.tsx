import { number, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { TruncateMiddle } from "./TruncateMiddle";

export default { title: "App / Components / TruncateMiddle", decorators: [withKnobs] };

export const Default = () => {
	const value = text("Text", "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT");
	const maxChars = number("Maximum characters", 16);

	return <TruncateMiddle text={value} maxChars={maxChars} />;
};
