import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";

type PeerRowProps = {
	coin?: string;
	coinClass?: string;
	name?: string;
	peerIp?: string;
	type?: string;
	actions?: any[];
	onAction?: any;
};

export const PeerRow = ({ coin, coinClass, name, peerIp, type, actions, onAction }: PeerRowProps) => (
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

		<TableCell innerClassName="text-theme-neutral justify-center">
			<Icon name={type!} width={20} height={20} />
		</TableCell>

		<TableCell variant="end" innerClassName="text-theme-neutral-300">
			{actions?.length && (() => <Dropdown options={actions} onSelect={onAction} />)()}
		</TableCell>
	</TableRow>
);

PeerRow.defaultProps = {
	actions: [],
};
