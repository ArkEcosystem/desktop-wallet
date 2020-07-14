import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import React, { useState } from "react";

import { CustomPeers } from "../CustomPeers";
import { PeerListItem } from "../PeerListItem";

type PeerListProps = {
	listColumns?: any;
	peers?: any;
	networks?: any;
};

export const PeerList = ({ listColumns, peers, networks }: PeerListProps) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	return (
		<div>
			<CustomPeers networks={networks} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />

			<Table columns={listColumns} data={peers}>
				{(rowData: any) => <PeerListItem {...rowData} />}
			</Table>

			<Button
				variant="plain"
				className="w-full mt-8 mb-2"
				onClick={() => setModalIsOpen(true)}
				data-testid="peer-list__add-button"
			>
				Add Peer
			</Button>
		</div>
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
