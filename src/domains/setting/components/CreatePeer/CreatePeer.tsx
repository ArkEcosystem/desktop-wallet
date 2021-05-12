import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { PeerForm } from "domains/setting/components/PeerForm";
import React from "react";
import { useTranslation } from "react-i18next";

type CreatePeerProps = {
	isOpen: boolean;
	profile: Contracts.IProfile;
	onClose?: () => void;
};

export const CreatePeer = ({ isOpen, profile, onClose }: CreatePeerProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleCreatePeer = async ({
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
		profile.peers().create(network.coin(), network.id(), {
			name,
			host,
			isMultiSignature,
		});

		await persist();

		onClose?.();
	};

	return (
		<Modal title={t("SETTINGS.MODAL_CUSTOM_PEER.TITLE")} size="xl" isOpen={isOpen} onClose={onClose}>
			<PeerForm profile={profile} onSave={handleCreatePeer} />
		</Modal>
	);
};

CreatePeer.defaultProps = {
	isOpen: false,
};
