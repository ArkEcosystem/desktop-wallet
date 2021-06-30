import React from "react";
import { styled } from "twin.macro";
import { Color } from "types";

import { getStyles } from "./Checkbox.styles";

type CheckboxProperties = {
	color?: Color;
	variant?: string;
} & React.InputHTMLAttributes<any>;

export const Checkbox = styled.input<CheckboxProperties>(getStyles);

Checkbox.defaultProps = {
	color: "success",
	type: "checkbox",
};
