import React from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { Icon } from "../Icon";

type AlertProps = {
	children: React.ReactNode;
	title?: string;
	variant?: "info" | "success" | "warning" | "danger" | "hint";
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
				return tw`px-10 py-8`;
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

	return <Icon name={iconVariant[variant]} width={26} height={26} />;
};

const getColorVariant = ({ variant }: { vartian: string }) => {
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
	<div className={`flex rounded-lg overflow-hidden bg-theme-neutral-100 border border-theme-neutral-300`}>
		<AlertIconWrapper size={size} className={`flex justify-center text-theme-${getColorVariant(variant)}-600`}>
			<AlertIcon variant={variant!} />
			<div className={`h-full border-r border-theme-${getColorVariant(variant)}-600 ml-4`} />
		</AlertIconWrapper>
		<AlertContent size={size} className="flex-1">
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
