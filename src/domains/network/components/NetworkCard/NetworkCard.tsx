import { CardControl } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import tw, { styled } from "twin.macro";

type NetworkCardProps = {
	icon?: string;
	network?: string;
	name?: string;
};

const NetworkItem = styled.div`
	[aria-checked="true"] & > .NetworkItemIcon {
		${tw`text-theme-success`}
	}
`;

export const NetworkCard = ({ icon, network, name }: NetworkCardProps) => (
	<CardControl type="radio" value={name} name="network">
		<NetworkItem className="flex items-center py-2">
			<Circle
				className="transition-colors duration-100 NetworkItemIcon border-theme-neutral-300"
				size="large"
				noShadow
			>
				<Icon name={icon!} />
			</Circle>
			<div className="flex flex-col ml-4">
				<span className="text-sm font-semibold">{network}</span>
				<span className="font-semibold text-theme-text">{name}</span>
			</div>
		</NetworkItem>
	</CardControl>
);

NetworkCard.defaultProps = {
	network: "mainnet",
};
