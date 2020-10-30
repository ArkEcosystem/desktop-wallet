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

const AlertContent = styled.div<{ size?: Size }>`
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`py-4`;
			case "lg":
				return tw`py-8`;
			default:
				return tw`py-6`;
		}
	}}
`;

const AlertIconWrapper = styled.div<{ size?: Size }>`
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`px-4 py-4`;
			case "lg":
				return tw`sm:px-0 md:px-10 pt-8 sm:pb-0 md:pb-8`;
			default:
				return tw`px-6 py-6`;
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

	return (
		<div className="items-center">
			<Icon name={iconVariant[variant]} width={26} height={26} className="inline-block" />
		</div>
	);
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
	<div className="overflow-hidden border rounded-lg sm:flex-row md:flex bg-theme-neutral-100 border-theme-neutral-300 sm:px-8 md:px-0">
		<AlertIconWrapper
			size={size}
			className={`sm:flex-row md:flex justify-center items-center text-center text-theme-${getColorVariant(
				variant,
			)}-600 sm:space-y-4 md:space-y-0`}
		>
			<AlertIcon variant={variant} />
			<div
				className={`sm:h-px md:h-full sm:border-b md:border-r border-theme-${getColorVariant(
					variant,
				)}-600 md:ml-6 sm:mt-8 md:mt-0`}
			/>
		</AlertIconWrapper>
		<AlertContent size={size} className="flex-1 pr-8">
			{title && (
				<p className={`text-lg font-bold text-theme-${getColorVariant(variant)}`} data-testid="alert__title">
					{title}
				</p>
			)}
			{children && <div className="text-sm">{children}</div>}
		</AlertContent>
	</div>
);

Alert.defaultProps = {
	variant: "warning",
};
