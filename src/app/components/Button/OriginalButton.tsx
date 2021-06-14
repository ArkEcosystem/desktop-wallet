import { Icon } from "app/components/Icon";
import { Spinner } from "app/components/Spinner";
import React from "react";
import { styled } from "twin.macro";
import { ButtonVariant,Size } from "types";

import { getStyles } from "./Button.styles";

type ButtonProps = {
	variant?: ButtonVariant;
	size?: Size;
	isLoading?: boolean;
	icon?: string;
	iconWidth?: number | string;
	iconHeight?: number | string;
	iconPosition?: "left" | "right";
} & React.ButtonHTMLAttributes<any>;

const StyledButton = styled.button<ButtonProps>(getStyles);

export const OriginalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, icon, isLoading, iconWidth, iconHeight, iconPosition, ...props }: ButtonProps, ref) => {
		const renderContent = () => {
			if (isLoading) {
				return (
					<div className="flex relative items-center">
						<span className="flex invisible items-center space-x-2">
							{icon && <Icon name={icon} width={iconWidth} height={iconHeight} />}
							{children}
						</span>

						<div className="absolute top-0 right-0 bottom-0 left-0">
							<Spinner size="sm" className="m-auto" />
						</div>
					</div>
				);
			}

			return (
				<>
					{icon && iconPosition === "left" && <Icon name={icon} width={iconWidth} height={iconHeight} />}
					{children}
					{icon && iconPosition === "right" && <Icon name={icon} width={iconWidth} height={iconHeight} />}
				</>
			);
		};

		return (
			<StyledButton {...props} ref={ref}>
				<div className="flex relative items-center space-x-2">{renderContent()}</div>
			</StyledButton>
		);
	},
);

OriginalButton.defaultProps = {
	type: "button",
	variant: "primary",
	iconWidth: 14,
	iconHeight: 14,
	iconPosition: "left",
};

OriginalButton.displayName = "Button";
