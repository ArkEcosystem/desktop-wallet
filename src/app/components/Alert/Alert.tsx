import cls from "classnames";
import React from "react";

import { Icon } from "../Icon";

export type AlertVariant = "info" | "success" | "warning" | "danger" | "hint";

interface AlertProperties {
	children: React.ReactNode;
	className?: string;
	title?: string;
	variant: AlertVariant;
}

const AlertIcon = ({ variant }: { variant: string }) => {
	const iconVariant: Record<string, string> = {
		info: "AlertInfo",
		success: "AlertSuccess",
		warning: "AlertWarning",
		danger: "AlertDanger",
		hint: "AlertHint",
	};

	return <Icon name={iconVariant[variant]} width="1.25em" height="1.25em" />;
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

export const Alert = ({ variant, title, children, className }: AlertProperties) => (
	<div
		className={cls(
			`flex overflow-hidden flex-col space-y-4 rounded-lg p-4 bg-theme-${
				variant === "info" ? "primary" : variant
			}-50 dark:bg-theme-secondary-800 sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-center`,
			className,
		)}
	>
		<div
			className={`h-11 w-11 flex flex-shrink-0 items-center justify-center rounded-lg text-white bg-theme-${getColorVariant(
				variant,
			)}`}
		>
			<AlertIcon variant={variant} />
		</div>
		<div className="flex flex-col w-full">
			{title && (
				<p className="font-semibold dark:text-theme-secondary-500" data-testid="Alert__title">
					{title}
				</p>
			)}
			{children && (
				<div className="text-sm leading-relaxed break-words dark:text-theme-secondary-500">{children}</div>
			)}
		</div>
	</div>
);

Alert.defaultProps = {
	variant: "warning",
};
