import { Table } from "app/components/Table";
import React from "react";

import { PeerListItem } from "./PeerListItem";

export default { title: "Settings / Components / PeerListItem" };

const data = [
	{
		coin: "Btc",
		coinClass: "text-theme-warning-400 border-theme-warning-200",
		name: "OLEBank",
		peerIp: "194.168.4.67:800",
		type: "Multisig",
		actions: [
			{
				label: "Edit",
				value: "edit",
			},
			{
				label: "Delete",
				value: "delete",
			},
		],
	},
];

const columns = [
	{
		Header: "Network",
	},
	{
		Header: "Name",
	},
	{
		Header: "Peer IP",
	},
	{
		Header: "Type",
		className: "flex justify-center",
	},
];

export const Default = () => (
	<Table columns={columns} data={data}>
		{(rowData: any) => <PeerListItem {...rowData} />}
	</Table>
);
