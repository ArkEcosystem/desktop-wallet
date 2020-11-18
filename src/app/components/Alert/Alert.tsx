import React from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { Icon } from "../Icon";

type AlertProps = {
	children: React.ReactNode;
	className?: string;
	title?: string;
	variant: "info" | "success" | "warning" | "danger" | "hint";
	type?: "horizontal" | "vertical";
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
		info: "primary-600",
		success: "success-600",
		warning: "warning-600",
		danger: "danger-400",
		hint: "hint-500",
	};

	return colorVariant[variant];
};

export const Alert = ({ className, variant, title, type, size, children }: AlertProps) => (
	<AlertWrapper
		size={size}
		className={`flex flex-col ${
			type === "horizontal" ? "sm:flex-row sm:space-y-0 sm:space-x-5" : "justify-center"
		} space-y-5 overflow-hidden border rounded-lg bg-theme-neutral-100 dark:bg-theme-neutral-800 border-theme-neutral-300 dark:border-theme-neutral-800 ${
			className ? className : ""
		}`}
	>
		<div className={`flex items-center justify-center text-theme-${getColorVariant(variant)}`}>
			<AlertIcon variant={variant} />
		</div>
		<span className={`pointer-events-none border rounded-md border-theme-${getColorVariant(variant)}`} />
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
	type: "horizontal",
};
