import React from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { Icon } from "../Icon";

type AlertProps = {
	children: React.ReactNode;
	title?: string;
	variant?: "primary" | "success" | "danger" | "warning" | "neutral";
	size?: Size;
};

const AlertContent = styled.div<{ size?: Size }>`
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`px-6 py-4`;
			case "lg":
				return tw`px-8 py-8`;
			default:
				return tw`px-8 py-6`;
		}
	}}
`;

const AlertIconWrapper = styled.div<{ size?: Size }>`
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`px-4 py-2`;
			case "lg":
				return tw`px-10 py-6`;
			default:
				return tw`px-6 py-4`;
		}
	}}
`;

const AlertIcon = ({ variant }: { variant: string }) => {
	const iconVariant: Record<string, string> = {
		primary: "AlertDefault",
		success: "AlertSuccess",
		danger: "AlertDanger",
		warning: "AlertDefault",
		neutral: "AlertDefault",
	};

	return <Icon name={iconVariant[variant]} width={30} height={30} />;
};

export const Alert = ({ variant, title, size, children }: AlertProps) => (
	<div className={`flex rounded-lg overflow-hidden bg-theme-${variant}`}>
		<AlertIconWrapper
			size={size}
			className={`flex items-center justify-center text-theme-${variant} bg-theme-${variant}-200`}
		>
			<AlertIcon variant={variant!} />
		</AlertIconWrapper>
		<AlertContent size={size} className={`flex-1 bg-theme-${variant}-100 space-y-2`}>
			{title && (
				<p className={`text-lg font-bold text-theme-${variant}`} data-testid="alert__title">
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
