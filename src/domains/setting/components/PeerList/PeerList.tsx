import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import React, { useState } from "react";

import { CustomPeers } from "../CustomPeers";
import { PeerListItem } from "../PeerListItem";

type PeerListProps = {
	listColumns?: any;
	peers?: any;
};

export const PeerList = ({ listColumns, peers }: PeerListProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Table columns={listColumns} data={peers}>
				{(rowData: any) => <PeerListItem {...rowData} />}
			</Table>

			<Button
				variant="plain"
				className="w-full mt-10 mb-5"
				onClick={() => setIsOpen(true)}
				data-testid="peer-list__add-button"
			>
				Add Peer
			</Button>

			<CustomPeers isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
};

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
