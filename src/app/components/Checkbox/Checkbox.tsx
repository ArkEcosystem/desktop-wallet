import React from "react";
import { styled } from "twin.macro";
import { getStyles } from "./style";

type CheckboxProps = {
	color?: "primary" | "success" | "danger" | "warning";
} & React.InputHTMLAttributes<any>;

export const Checkbox = styled.input<CheckboxProps>(getStyles);

Checkbox.defaultProps = {
	type: "checkbox",
	color: "success",
};
