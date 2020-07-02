import React from "react";
import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./Button.styles";

type ButtonProps = {
	color?: "primary" | "success" | "danger" | "warning" | "neutral";
	variant?: "solid" | "plain" | "outline";
	size?: Size;
} & React.ButtonHTMLAttributes<any>;

export const Button = styled.button<ButtonProps>(getStyles);

Button.defaultProps = {
	type: "button",
	color: "primary",
	variant: "solid",
};
