import { Avatar as AvatarSDK } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import tw, { css, styled } from "twin.macro";
import { Size } from "types";

type Props = {
	address: string;
	size?: Size;
	children?: React.ReactNode;
	noShadow?: boolean;
	className?: string;
	shadowColor?: string;
};

export const AvatarWrapper = styled.div<{ shadowColor?: string; size?: string; noShadow?: boolean }>`
	${tw`relative inline-flex items-center justify-center overflow-hidden align-middle rounded-full`}
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`w-8 h-8`;
			case "lg":
				return tw`w-11 h-11`;
			default:
				return tw`w-10 h-10`;
		}
	}}
	${({ noShadow, shadowColor }) =>
		!noShadow &&
		css`
			& {
				box-shadow: 0 0 0 6px var(${shadowColor ? shadowColor : "--theme-background-color"});
			}
		`};
`;

export const Avatar = ({ address, size, noShadow, className, shadowColor, children }: Props) => {
	const svg = React.useMemo(() => AvatarSDK.make(address), [address]);

	return (
		<AvatarWrapper
			data-testid="Avatar"
			size={size}
			noShadow={!!noShadow}
			className={className}
			shadowColor={shadowColor}
		>
			<div className="w-full h-full">
				<img alt={address} title={address} src={`data:image/svg+xml;utf8,${svg}`} />
			</div>
			{children}
		</AvatarWrapper>
	);
};

Avatar.defaultProps = {
	address: "",
};
