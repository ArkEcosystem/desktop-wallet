import { Avatar as AvatarSDK } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import tw, { css, styled } from "twin.macro";

type Props = {
	address: string;
	size?: "small" | "large" | "default";
	noShadow?: boolean;
	className?: string;
	shadowColor?: string;
};

export const AvatarWrapper = styled.div<{ shadowColor?: string; size: string; noShadow?: boolean }>`
	${tw`block rounded-full overflow-hidden`}
	${({ size }) => {
		switch (size) {
			case "large":
				return tw`w-12 h-12`;
			case "small":
				return tw`w-8 h-8`;
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

export const Avatar = ({ address, size, noShadow, className, shadowColor }: Props) => {
	const svg = React.useMemo(() => AvatarSDK.make(address), [address]);

	return (
		<AvatarWrapper
			data-testid="Avatar"
			size={size!}
			noShadow={!!noShadow}
			className={className}
			shadowColor={shadowColor}
		>
			<img title={address} src={`data:image/svg+xml;utf8,${svg}`} />
		</AvatarWrapper>
	);
};

Avatar.defaultProps = {
	size: "default",
};
