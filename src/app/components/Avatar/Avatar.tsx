import { Avatar as AvatarSDK } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import tw, { css, styled } from "twin.macro";
import { Size } from "types";

type Props = {
	address: string;
	size?: Size;
	children?: React.ReactNode;
	noShadow?: boolean;
	highlight?: boolean;
	className?: string;
	shadowColor?: string;
};

export const AvatarWrapper = styled.div<{
	shadowColor?: string;
	size?: string;
	noShadow?: boolean;
	highlight?: boolean;
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
	${({ noShadow, shadowColor, highlight }) => {
		if (!noShadow) {
			return highlight
				? css`
						& {
							box-shadow: 0 0 0 2px var(--theme-color-primary-600),
								0 0 0 6px var(${shadowColor ? shadowColor : "--theme-background-color"});
						}
				  `
				: css`
						& {
							box-shadow: 0 0 0 6px var(${shadowColor ? shadowColor : "--theme-background-color"});
						}
				  `;
		}
	}};
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
