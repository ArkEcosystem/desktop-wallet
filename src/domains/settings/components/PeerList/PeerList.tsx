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
	const [modalIsOpen, setModalIsOpen] = useState(false);

	return (
		<div className="m-0">
			<Table columns={listColumns} data={peers}>
				{(rowData: any) => <PeerListItem {...rowData} />}
			</Table>

			<Button
				variant="plain"
				className="w-full mt-5 mb-5"
				onClick={() => setModalIsOpen(true)}
				data-testid="peer-list__add-button"
			>
				Add Peer
			</Button>

			<CustomPeers isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
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
