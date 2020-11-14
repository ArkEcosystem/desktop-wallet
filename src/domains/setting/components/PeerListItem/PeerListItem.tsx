import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";

type PeerListItemProps = {
	coin?: string;
	coinClass?: string;
	name?: string;
	peerIp?: string;
	type?: string;
	options?: DropdownOption[];
	onAction?: any;
};

export const PeerListItem = ({ coin, coinClass, name, peerIp, type, options, onAction }: PeerListItemProps) => (
	<TableRow>
		<TableCell variant="start" innerClassName="space-x-2">
			<Circle className={coinClass} noShadow>
				<Icon name={coin!} />
			</Circle>
			<span>{coin?.toLocaleUpperCase()}</span>
		</TableCell>

		<TableCell>
			<span>{name}</span>
		</TableCell>

		<TableCell>
			<span>{peerIp}</span>
		</TableCell>

		<TableCell innerClassName="justify-center">
			<Icon name={type!} width={20} height={20} />
		</TableCell>

		<TableCell variant="end" innerClassName="text-theme-neutral-300">
			{options!.length > 0 && (
				<Dropdown
					toggleContent={
						<div className="float-right">
							<Button variant="plain" size="icon">
								<Icon name="Settings" width={20} height={20} />
							</Button>
						</div>
					}
					options={options}
					onSelect={(action: DropdownOption) => onAction?.(action)}
				/>
			)}
		</TableCell>
	</TableRow>
);

PeerListItem.defaultProps = {
	options: [
		{ label: "Edit", value: "edit" },
		{ label: "Delete", value: "send" },
	],
};
