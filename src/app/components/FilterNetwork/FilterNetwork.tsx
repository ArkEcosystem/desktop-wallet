import { Badge } from "app/components/Badge";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React, { useState } from "react";

type Network = {
	name: string;
	isSelected: Boolean;
};

type NetworkProps = {
	networks?: any;
	onChange?: any;
	onViewAll?: any;
	hideViewAll?: boolean;
};

const renderNetworks = (networks: any[], onClick: any) => (
	<ul data-testid="network__option" className="inline-block">
		{networks.map((option: Network, key: number) => (
			<li
				className="inline-block mr-5 cursor-pointer"
				key={key}
				data-testid={`network__option--${key}`}
				onClick={() => onClick(option, key)}
			>
				{option.isSelected ? (
					<Circle size="lg" className="relative border-theme-success-500 text-theme-success-500">
						<Icon name={option.name} width={20} height={20} />
						<Badge className="bg-theme-success-500 text-theme-success-contrast" icon="Checkmark" />
					</Circle>
				) : (
					<Circle size="lg" className="relative border-theme-neutral-200 text-theme-neutral-300">
						<Icon name={option.name} width={20} height={20} />
						<Badge className="border-theme-neutral-200" />
					</Circle>
				)}
			</li>
		))}
	</ul>
);

export const FilterNetwork = ({ networks, onChange, onViewAll, hideViewAll }: NetworkProps) => {
	const [networkList, setNetworkList] = useState(networks.concat());

	const onClick = (network: Network, index: number) => {
		const list = networkList.concat();

		network.isSelected = !network.isSelected;
		list.splice(index, 1, network);
		setNetworkList(list);

		if (typeof onChange === "function") {
			onChange(network, list);
		}
	};

	return (
		<div>
			{renderNetworks(networkList, onClick)}

			{!hideViewAll && (
				<Circle
					size="lg"
					data-testid="network__viewall"
					className="relative cursor-pointer border-theme-primary-100"
					onClick={onViewAll}
				>
					<div className="text-sm font-semibold text-theme-primary-500">All</div>
					<Badge
						className="border-theme-primary-100 text-theme-primary-500"
						icon="ChevronDown"
						iconWidth={10}
						iconHeight={10}
					/>
				</Circle>
			)}
		</div>
	);
};

FilterNetwork.defaultProps = {
	isSelected: false,
	networks: [],
	hideViewAll: false,
};
