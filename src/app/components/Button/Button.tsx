import { pluginManager } from "app/PluginProviders";
import { withThemeDecorator } from "plugins";
import React from "react";
import { styled } from "twin.macro";
import { ButtonVariant, Size } from "types";

import { getStyles } from "./Button.styles";

type ButtonProps = {
	color?: "primary" | "success" | "danger" | "warning" | "neutral";
	variant?: ButtonVariant;
	size?: Size;
} & React.ButtonHTMLAttributes<any>;

const StyledButton = styled.button<ButtonProps>(getStyles);

export const OriginalButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref) => (
	<StyledButton {...props} ref={ref} />
));
OriginalButton.defaultProps = {
	type: "button",
	color: "primary",
	variant: "solid",
};
OriginalButton.displayName = "Button";

export const Button = withThemeDecorator("button", OriginalButton, pluginManager);
