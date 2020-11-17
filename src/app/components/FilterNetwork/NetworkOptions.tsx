import { Badge } from "app/components/Badge";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";

import { Network } from "./";

export const NetworkOption = ({ coin, id, name, isSelected, onClick }: Network) => {
	const networkExtendedData = coin && id ? getNetworkExtendedData({ coin, network: id }) : undefined;
	if (!networkExtendedData) return <></>;

	const { iconName } = networkExtendedData;

	return (
		<li className="inline-block ml-5 cursor-pointer" onClick={onClick}>
			<Tooltip content={name}>
				{isSelected ? (
					<Circle size="lg" className="relative border-theme-success-500 text-theme-success-500">
						<Icon name={iconName} width={20} height={20} />
						<Badge className="bg-theme-success-500 text-theme-success-contrast" icon="Checkmark" />
					</Circle>
				) : (
					<Circle
						size="lg"
						className="relative border-theme-neutral-300 dark:border-theme-neutral-800 text-theme-neutral-300"
					>
						<Icon name={iconName} width={20} height={20} />
						<Badge className="border-theme-neutral-300 dark:border-theme-neutral-800" />
					</Circle>
				)}
			</Tooltip>
		</li>
	);
};

export const NetworkOptions = ({ networks, onClick }: { networks: Network[]; onClick: any }) => (
	<ul data-testid="network__option" className="inline-block">
		{networks.map((network: Network, key: number) => (
			<NetworkOption
				{...network}
				key={key}
				onClick={() => onClick(network, key)}
				data-testid={`network__option--${key}`}
			 />
		))}
	</ul>
);
