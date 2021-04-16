import React from "react";
import { styled } from "twin.macro";
import { Color } from "types";

import { getStyles } from "./Checkbox.styles";

type CheckboxProps = {
	color?: Color;
	variant?: string;
} & React.InputHTMLAttributes<any>;

export const Checkbox = styled.input<CheckboxProps>(getStyles);

Checkbox.defaultProps = {
	type: "checkbox",
	color: "success",
};
