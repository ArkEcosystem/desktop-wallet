import React from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { Icon } from "../Icon";

type AlertProps = {
	children: React.ReactNode;
	title?: string;
	variant: "info" | "success" | "warning" | "danger" | "hint";
	size?: Size;
};

const AlertWrapper = styled.div<{ size?: Size }>`
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`p-4`;
			case "lg":
				return tw`p-8`;
			default:
				return tw`p-6`;
		}
	}}
`;

const AlertIcon = ({ variant }: { variant: string }) => {
	const iconVariant: Record<string, string> = {
		info: "AlertInfo",
		success: "AlertSuccess",
		warning: "AlertWarning",
		danger: "AlertDanger",
		hint: "AlertHint",
	};

	return <Icon name={iconVariant[variant]} width="1.75em" height="1.75em" />;
};

const getColorVariant = (variant: string) => {
	const colorVariant: Record<string, string> = {
		info: "primary",
		success: "success",
		warning: "warning",
		danger: "danger",
		hint: "hint",
	};

	return colorVariant[variant];
};

export const Alert = ({ variant, title, size, children }: AlertProps) => (
	<AlertWrapper
		size={size}
		className="flex flex-col space-y-5 overflow-hidden border rounded-lg bg-theme-neutral-100 border-theme-neutral-300 sm:space-y-0 sm:space-x-5 sm:flex-row"
	>
		<div className={`flex items-center justify-center text-theme-${getColorVariant(variant)}-600`}>
			<AlertIcon variant={variant} />
		</div>
		<span className={`pointer-events-none border rounded-md border-theme-${getColorVariant(variant)}-600`} />
		<div className="flex flex-col space-y-2">
			{title && (
				<p className={`text-lg font-bold text-theme-${getColorVariant(variant)}`} data-testid="alert__title">
					{title}
				</p>
			)}
			{children && <p className="leading-relaxed break-words">{children}</p>}
		</div>
	</AlertWrapper>
);

Alert.defaultProps = {
	variant: "warning",
};
