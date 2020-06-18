import { action } from "@storybook/addon-actions";
import React from "react";

import { InputCurrency } from "./InputCurrency";

export default { title: "Input / Input / InputCurrency" };

export const Default = () => {
	return <InputCurrency onChange={action("onChange")} />;
};
