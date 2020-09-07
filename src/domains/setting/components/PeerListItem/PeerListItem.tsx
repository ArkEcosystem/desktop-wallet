import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell } from "app/components/Table";
import React from "react";

type PeerListItemProps = {
	coin?: string;
	coinClass?: string;
	name?: string;
	peerIp?: string;
	type?: string;
	actions?: any[];
	onAction?: any;
};

export const PeerListItem = ({ coin, coinClass, name, peerIp, type, actions, onAction }: PeerListItemProps) => (
	<tr className="border-b border-dashed border-theme-neutral-200 group transition-colors duration-100">
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

		<TableCell innerClassName="text-theme-neutral justify-center">
			<Icon name={type!} />
		</TableCell>

		<TableCell variant="end" innerClassName="text-theme-neutral-300">
			{actions?.length && (() => <Dropdown options={actions} onSelect={onAction} />)()}
		</TableCell>
	</tr>
);

PeerListItem.defaultProps = {
	actions: [],
};
