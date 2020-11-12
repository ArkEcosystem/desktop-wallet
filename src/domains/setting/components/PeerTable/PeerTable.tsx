import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import { CustomPeers } from "domains/setting/components/CustomPeers";
import { DeletePeer } from "domains/setting/components/DeletePeer";
import { PeerRow } from "domains/setting/components/PeerTable/PeerRow";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type PeerTableProps = {
	networks: Coins.Network[];
	profile: Profile;
};

export const PeerTable = ({ networks, profile }: PeerTableProps) => {
	const { t } = useTranslation();

	const [peerAction, setPeerAction] = useState<string | null>(null);
	const [isCustomPeers, setIsCustomPeers] = useState(false);

	const peers = useMemo(() => profile.peers().values(), [profile]);

	const options = [
		{ label: t("COMMON.EDIT"), value: "edit" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	const columns = [
		{
			Header: t("SETTINGS.PEERS.CRYPTOASSET"),
			accessor: "cryptoasset",
		},
		{
			Header: t("SETTINGS.PEERS.NAME"),
			accessor: "name",
		},
		{
			Header: t("SETTINGS.PEERS.IP"),
		},
		{
			Header: t("SETTINGS.PEERS.TYPE"),
			className: "flex justify-center no-border",
		},
		{
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

	const resetPeerAction = () => {
		setPeerAction(null);
	};

	return (
		<div>
			<Table columns={columns} data={peers}>
				{(rowData: any) => <PeerRow {...rowData} options={options} />}
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

			<DeletePeer isOpen={peerAction === "delete"} onCancel={resetPeerAction} onClose={resetPeerAction} />
		</div>
	);
};
