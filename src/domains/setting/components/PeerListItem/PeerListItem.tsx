import { Button } from "app/components/Button";
import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";

type PeerListItemProps = {
	coin: string;
	network: string;
	name: string;
	host: string;
	isMultiSignature: boolean;
	options?: DropdownOption[];
	onAction?: any;
};

export const PeerListItem = ({ coin, network, name, host, isMultiSignature, options, onAction }: PeerListItemProps) => {
	const networkExtendedData = getNetworkExtendedData({ coin, network });

	return (
		<TableRow>
			<TableCell variant="start" innerClassName="space-x-2">
				<NetworkIcon size="lg" coin={coin.toUpperCase()} network={network} noShadow />
				<span>{networkExtendedData?.displayName}</span>
			</TableCell>

			<TableCell>
				<span>{name}</span>
			</TableCell>

			<TableCell>
				<span>{host}</span>
			</TableCell>

			<TableCell innerClassName="justify-center">
				{isMultiSignature && <Icon name="Multisig" width={20} height={20} />}
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				{options!.length > 0 && (
					<Dropdown
						toggleContent={
							<div className="float-right">
								<Button variant="secondary" size="icon">
									<Icon name="Settings" width={20} height={20} />
								</Button>
							</div>
						}
						options={options}
						onSelect={(action: DropdownOption) =>
							onAction?.(action.value, { coin, network, name, host, isMultiSignature })
						}
					/>
				)}
			</TableCell>
		</TableRow>
	);
};

PeerListItem.defaultProps = {
	options: [
		{ label: "Edit", value: "edit" },
		{ label: "Delete", value: "send" },
	],
};
