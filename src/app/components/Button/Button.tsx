import { Icon } from "app/components//Icon";
import { Spinner } from "app/components/Spinner";
import { pluginManager } from "app/PluginProviders";
import { withThemeDecorator } from "plugins";
import React from "react";
import { styled } from "twin.macro";
import { ButtonVariant, Size } from "types";

import { getStyles } from "./Button.styles";

type ButtonProps = {
	variant?: ButtonVariant;
	size?: Size;
	isLoading?: boolean;
	icon?: string;
	iconWidth?: number | string;
	iconHeight?: number | string;
} & React.ButtonHTMLAttributes<any>;

const StyledButton = styled.button<ButtonProps>(getStyles);

export const OriginalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, icon, isLoading, iconWidth = 14, iconHeight = 14, ...props }: ButtonProps, ref) => (
		<StyledButton {...props} ref={ref}>
			<div className="flex items-center space-x-2 relative">
				{icon && <Icon name={icon} width={iconWidth} height={iconHeight} />}

				{!isLoading && <>{children}</>}

				{isLoading && (
					<>
						<span className="invisible">{children}</span>

						<Spinner size="sm" className="absolute right-0 top-0 bottom-0" />
					</>
				)}
			</div>
		</StyledButton>
	),
);

OriginalButton.defaultProps = {
	type: "button",
	variant: "primary",
};

OriginalButton.displayName = "Button";

// Expose button to be overriden by plugins
export const Button = withThemeDecorator("button", OriginalButton, pluginManager);
