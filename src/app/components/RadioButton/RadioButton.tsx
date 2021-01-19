import React from "react";
import { styled } from "twin.macro";
import { Color } from "types";

import { getStyles } from "./RadioButton.styles";

type RadioButtonProps = {
	color?: Color;
} & React.InputHTMLAttributes<any>;

export const RadioButton = styled.input<RadioButtonProps>(getStyles);

RadioButton.defaultProps = {
	type: "radio",
	color: "success",
};
