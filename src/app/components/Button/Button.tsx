import React from "react";
import { styled } from "twin.macro";
import { getStyles } from "./style";

type ButtonProps = {
	color?: "primary" | "success" | "danger" | "warning" | "neutral";
	variant?: "solid" | "plain" | "outline";
	size?: "small" | "default" | "large";
} & React.ButtonHTMLAttributes<any>;

export const Button = styled.button<ButtonProps>(getStyles);

Button.defaultProps = {
	type: "button",
	color: "primary",
	variant: "solid",
	size: "default",
};
