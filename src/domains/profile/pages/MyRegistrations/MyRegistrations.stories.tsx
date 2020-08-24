import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { MyRegistrations } from "./MyRegistrations";

export default {
	title: "Domains / Profile / Pages / MyRegistrations",
	decorators: [withKnobs],
};

export const Default = () => <MyRegistrations />;
