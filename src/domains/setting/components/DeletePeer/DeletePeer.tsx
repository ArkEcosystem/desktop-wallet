import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { DeleteResource } from "app/components/DeleteResource";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useTranslation } from "react-i18next";

type DeletePeerProps = {
	isOpen: boolean;
	network?: Coins.Network;
	profile: Profile;
	onCancel?: () => void;
	onClose?: () => void;
	onDelete?: any;
};

export const DeletePeer = ({ isOpen, network, profile, onCancel, onClose, onDelete }: DeletePeerProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleDelete = async () => {
		profile.peers().forget(network!.coin(), network!.id());
		await persist();

		onDelete?.();
	};

	return (
		<DeleteResource
			title={t("CONTACTS.MODAL_DELETE_PEER.TITLE")}
			description={t("CONTACTS.MODAL_DELETE_PEER.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onCancel}
			onDelete={handleDelete}
		/>
	);
};

DeletePeer.defaultProps = {
	isOpen: false,
};
