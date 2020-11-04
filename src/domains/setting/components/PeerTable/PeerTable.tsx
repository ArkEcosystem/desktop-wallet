import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import { CustomPeers } from "domains/setting/components/CustomPeers";
import { PeerRow } from "domains/setting/components/PeerTable/PeerRow";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type PeerTableProps = {
	peers?: any;
	networks?: any;
};

export const PeerTable = ({ peers, networks }: PeerTableProps) => {
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
		{
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

	return (
		<div>
			<Table columns={columns} data={peers}>
				{(rowData: any) => <PeerRow {...rowData} />}
			</Table>

			<Button
				variant="plain"
				className="w-full mt-8 mb-2"
				onClick={() => setIsCustomPeers(true)}
				data-testid="peer-list__add-button"
			>
				{t("SETTINGS.PEERS.ADD_PEER")}
			</Button>

			<CustomPeers networks={networks} isOpen={isCustomPeers} onClose={() => setIsCustomPeers(false)} />
		</div>
	);
};

PeerTable.defaultProps = {
	peers: [],
};
