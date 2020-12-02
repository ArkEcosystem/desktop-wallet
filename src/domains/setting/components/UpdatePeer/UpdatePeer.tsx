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
	onValidateHost?: any;
};

export const UpdatePeer = ({ isOpen, networks, peer, profile, onClose, onValidateHost }: UpdatePeerProps) => {
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
		if (network.coin() === peer.coin && network.id() === peer.network) {
			profile.peers().update(network.coin(), network.id(), peer.host, {
				name,
				host,
				isMultiSignature,
			});
		} else {
			profile.peers().forget(peer.coin, peer.network, peer);
			profile.peers().create(network.coin(), network.id(), {
				name,
				host,
				isMultiSignature,
			});
		}

		await persist();

		onClose?.();
	};

	return (
		<Modal title={t("SETTINGS.MODAL_CUSTOM_PEER.TITLE")} size="xl" isOpen={isOpen} onClose={onClose}>
			<PeerForm networks={networks} peer={peer} onValidateHost={onValidateHost} onSave={handleUpdatePeer} />
		</Modal>
	);
};

UpdatePeer.defaultProps = {
	isOpen: false,
	networks: [],
};
