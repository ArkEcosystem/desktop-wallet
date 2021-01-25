import { pluginManager } from "app/PluginProviders";
import { withThemeDecorator } from "plugins";
import React from "react";
import { styled } from "twin.macro";
import { ButtonVariant, Size } from "types";

import { getStyles } from "./Button.styles";

type ButtonProps = {
	variant?: ButtonVariant;
	size?: Size;
} & React.ButtonHTMLAttributes<any>;

const StyledButton = styled.button<ButtonProps>(getStyles);

export const OriginalButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref) => (
	<StyledButton {...props} ref={ref} />
));

OriginalButton.defaultProps = {
	type: "button",
	variant: "primary",
};

OriginalButton.displayName = "Button";

// Expose button to be overriden by plugins
export const Button = withThemeDecorator("button", OriginalButton, pluginManager);
