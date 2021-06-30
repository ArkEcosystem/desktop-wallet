import { Icon } from "app/components/Icon";
import { Spinner } from "app/components/Spinner";
import React from "react";
import { styled } from "twin.macro";
import { ButtonVariant, Size } from "types";

import { getStyles } from "./Button.styles";

type ButtonProperties = {
	variant?: ButtonVariant;
	size?: Size;
	isLoading?: boolean;
	icon?: string;
	iconWidth?: number | string;
	iconHeight?: number | string;
	iconPosition?: "left" | "right";
} & React.ButtonHTMLAttributes<any>;

const StyledButton = styled.button<ButtonProperties>(getStyles);

export const OriginalButton = React.forwardRef<HTMLButtonElement, ButtonProperties>(
	(
		{ children, icon, isLoading, iconWidth, iconHeight, iconPosition, ...properties }: ButtonProperties,
		reference,
	) => {
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
			<StyledButton {...properties} ref={reference}>
				<div className="flex relative items-center space-x-2">{renderContent()}</div>
			</StyledButton>
		);
	},
);

OriginalButton.defaultProps = {
	iconHeight: 14,
	iconPosition: "left",
	iconWidth: 14,
	type: "button",
	variant: "primary",
};

OriginalButton.displayName = "Button";
