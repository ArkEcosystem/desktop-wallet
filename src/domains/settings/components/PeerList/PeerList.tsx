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

			<Button color="primary" variant="plain" className="w-full mt-10 mb-5" onClick={() => setIsOpen(true)}>
				Add Peer
			</Button>

			<CustomPeers isOpen={isOpen} onClose={() => setIsOpen(false)} onAddPeer={() => alert("added peer")} />
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
