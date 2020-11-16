import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { PeerForm } from "domains/setting/components/PeerForm";
import React from "react";
import { useTranslation } from "react-i18next";

type AddPeerProps = {
	isOpen: boolean;
	networks: Coins.Network[];
	profile: Profile;
	onClose?: () => void;
};

export const AddPeer = ({ isOpen, networks, profile, onClose }: AddPeerProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleOnAddPeer = async ({
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
		const [, networkId] = network.id().split(".");
		const coin = network.coin();

		profile.peers().create(coin, networkId, {
			name,
			host,
			isMultiSignature,
		});

		await persist();

		onClose?.();
	};

	return (
		<Modal title={t("SETTINGS.MODAL_CUSTOM_PEER.TITLE")} size="xl" isOpen={isOpen} onClose={onClose}>
			<PeerForm networks={networks} onSave={handleOnAddPeer} />
		</Modal>
	);
};

AddPeer.defaultProps = {
	isOpen: false,
	networks: [],
};
