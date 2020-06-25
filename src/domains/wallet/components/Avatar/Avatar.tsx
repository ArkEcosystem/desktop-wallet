import { Avatar as AvatarSDK } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import tw, { css, styled } from "twin.macro";

type Props = {
	address: string;
	size?: "small" | "large" | "default";
	noShadow?: boolean;
	className?: string;
};

const AvatarStyled = styled.div<{ size: string; noShadow: boolean }>`
	${tw`block rounded-full`}
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
	${({ noShadow }) =>
		!noShadow &&
		css`
			& {
				box-shadow: 0 0 0 6px var(--theme-background-color);
			}
		`};
`;

export const Avatar = ({ address, size, noShadow, className }: Props) => {
	const gradients = React.useMemo(() => AvatarSDK.make(address), [address]);

	return (
		<AvatarStyled
			data-testid="Avatar"
			size={size!}
			noShadow={!!noShadow}
			className={className}
			style={{ background: gradients }}
		/>
	);
};

Avatar.defaultProps = {
	size: "default",
};
