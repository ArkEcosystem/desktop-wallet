import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import React from "react";

import { PeerListItem } from "../PeerListItem";

type PeerListProps = {
	listColumns?: any;
	peers?: any;
};

export const PeerList = ({ listColumns, peers }: PeerListProps) => (
	<div>
		<Table columns={listColumns} data={peers}>
			{(rowData: any) => <PeerListItem {...rowData} />}
		</Table>

		<Button color="primary" variant="plain" className="w-full mt-10 mb-5">
			Add Peer
		</Button>
	</div>
);

PeerList.defaultProps = {
	peers: [],
	listColumns: [
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
	],
};
