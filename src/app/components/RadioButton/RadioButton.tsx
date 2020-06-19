import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./RadioButton.styles";

type RadioButtonProps = {
	color?: "primary" | "success" | "danger" | "warning";
} & React.InputHTMLAttributes<any>;

export const RadioButton = styled.input<RadioButtonProps>(getStyles);

RadioButton.defaultProps = {
	type: "radio",
	color: "success",
};
