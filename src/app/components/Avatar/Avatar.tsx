import { Helpers } from "@arkecosystem/platform-sdk-profiles";
import cn from "classnames";
import React from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

type Props = {
	address: string;
	className?: string;
	shadowClassName?: string;
	highlight?: boolean;
	noShadow?: boolean;
	size?: Size;
	children?: React.ReactNode;
};

export const AvatarWrapper = styled.div<{
	highlight?: boolean;
	noShadow?: boolean;
	shadowClassName?: string;
	size?: string;
}>`
	${tw`transition-all duration-100 relative inline-flex items-center justify-center overflow-hidden align-middle rounded-full`}

	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`w-8 h-8 text-sm`;
			case "lg":
				return tw`w-11 h-11 text-sm`;
			case "xl":
				return tw`w-16 h-16 text-xl`;
			default:
				return tw`w-10 h-10`;
		}
	}}

	${({ noShadow, shadowClassName }) =>
		noShadow ? tw`ring-0` : shadowClassName ? tw`ring-6` : tw`ring-6 ring-theme-background`}
`;

export const Avatar = ({ address, className, highlight, noShadow, shadowClassName, size, children }: Props) => {
	const svg = React.useMemo(() => Helpers.Avatar.make(address), [address]);

	return (
		<AvatarWrapper
			data-testid="Avatar"
			size={size}
			noShadow={!!noShadow}
			highlight={highlight}
			className={cn(className, shadowClassName)}
			shadowClassName={shadowClassName}
		>
			<div className={cn("w-full h-full", { "ring-2 ring-theme-primary-600": highlight })}>
				<img alt={address} title={address} src={`data:image/svg+xml;utf8,${svg}`} />
			</div>
			{children}
		</AvatarWrapper>
	);
};

Avatar.defaultProps = {
	address: "",
};
