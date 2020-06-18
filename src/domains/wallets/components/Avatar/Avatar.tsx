import { Avatar as AvatarSDK } from "@arkecosystem/platform-sdk-profiles/dist/avatar";
import React from "react";
import tw, { styled } from "twin.macro";

type Props = {
	address: string;
	size?: "small" | "large" | "default";
};

const AvatarStyled = styled.div<{ size: string }>`
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
`;

export const Avatar = ({ address, size }: Props) => {
	const gradients = React.useMemo(() => AvatarSDK.make(address), [address]);

	return (
		<AvatarStyled
			data-testid="Avatar"
			size={size!}
			className="block rounded-full"
			style={{ background: gradients }}
		/>
	);
};

Avatar.defaultProps = {
	size: "default",
};
