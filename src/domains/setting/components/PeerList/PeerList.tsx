import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import { CustomPeers } from "domains/setting/components/CustomPeers";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { PeerListItem } from "../PeerListItem";

type PeerListProps = {
	peers?: any;
	networks?: any;
};

export const PeerList = ({ peers, networks }: PeerListProps) => {
	const { t } = useTranslation();

	const [isCustomPeers, setIsCustomPeers] = useState(false);

	const columns = [
		{
			Header: t("SETTINGS.PEERS.CRYPTOASSET"),
		},
		{
			Header: t("SETTINGS.PEERS.NAME"),
		},
		{
			Header: t("SETTINGS.PEERS.IP"),
		},
		{
			Header: t("SETTINGS.PEERS.TYPE"),
			className: "flex justify-center",
		},
	];

	return (
		<div>
			<Table columns={columns} data={peers}>
				{(rowData: any) => <PeerListItem {...rowData} />}
			</Table>

			<Button
				variant="plain"
				className="w-full mt-8 mb-2"
				onClick={() => setIsCustomPeers(true)}
				data-testid="peer-list__add-button"
			>
				{t("SETTINGS.PEERS.ADD_PEER")}
			</Button>

			<CustomPeers isOpen={isCustomPeers} onClose={() => setIsCustomPeers(false)} />
		</div>
	);
};

PeerList.defaultProps = {
	peers: [],
};
