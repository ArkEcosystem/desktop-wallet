import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";

type PeerListItemProps = {
	coinIcon?: string;
	coinClass?: string;
	name?: string;
	peerIp?: string;
	type?: string;
	actions?: any[];
	onAction?: any;
};

export const PeerListItem = ({ coinIcon, coinClass, name, peerIp, type, actions, onAction }: PeerListItemProps) => (
	<tr className="border-b border-theme-neutral-200">
		<td className="py-4 mt-1">
			<Circle className={coinClass}>
				<Icon name={coinIcon!} />
			</Circle>
		</td>
		<td className="py-1">
			<span>{name}</span>
		</td>
		<td className="py-1">
			<span>{peerIp}</span>
		</td>
		<td className="py-1 text-theme-primary-300">
			<div className="flex justify-center h-full">
				<Icon name={type!} />
			</div>
		</td>
		<td>
			{actions?.length &&
				(() => {
					return <Dropdown options={actions} onSelect={onAction} />;
				})()}
		</td>
	</tr>
);

PeerListItem.defaultProps = {
	actions: [],
};
