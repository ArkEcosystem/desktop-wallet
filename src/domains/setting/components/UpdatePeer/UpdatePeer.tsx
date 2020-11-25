import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { PeerForm } from "domains/setting/components/PeerForm";
import React from "react";
import { useTranslation } from "react-i18next";

type UpdatePeerProps = {
	isOpen: boolean;
	networks: Coins.Network[];
	peer: any;
	profile: Profile;
	onClose?: () => void;
};

export const UpdatePeer = ({ isOpen, networks, peer, profile, onClose }: UpdatePeerProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleUpdatePeer = async ({
		network,
		name,
		host,
		isMultiSignature,
	}: {
		network: Coins.Network;
		name: string;
		host: string;
		isMultiSignature: boolean;
	}) => {
		profile.peers().update(network.coin(), network.id(), host, {
			name,
			host,
			isMultiSignature,
		});

		await persist();

		onClose?.();
	};

	return (
		<Modal title={t("SETTINGS.MODAL_CUSTOM_PEER.TITLE")} size="xl" isOpen={isOpen} onClose={onClose}>
			<PeerForm networks={networks} peer={peer} onSave={handleUpdatePeer} />
		</Modal>
	);
};

UpdatePeer.defaultProps = {
	isOpen: false,
	networks: [],
};
