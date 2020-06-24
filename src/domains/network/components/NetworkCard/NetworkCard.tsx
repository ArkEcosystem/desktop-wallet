import { CardControl } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";


type NetworkCardProps = {
	icon?: string;
	name?: string;
	network?: string;
	onChange?: any;
};

export const NetworkCard = ({ icon, name, network, onChange }: NetworkCardProps) => (
	<CardControl type="radio" value={name} name="network" onChange={() => onChange(name)}>
		<div className="flex items-center py-2">
			<Circle className="transition-colors duration-100 border-theme-neutral-300" size="large" noShadow>
				<Icon name={icon!} data-testid="network-card--icon" />
			</Circle>
			<div className="flex flex-col ml-4">
				<span className="text-sm font-semibold text-theme-neutral-500" data-testid="network-card--network">
					{network}
				</span>
				<span className="font-semibold text-theme-text" data-testid="network-card--name">
					{name}
				</span>
			</div>
		</div>
	</CardControl>
);

NetworkCard.defaultProps = {
	network: "Mainnet",
};
