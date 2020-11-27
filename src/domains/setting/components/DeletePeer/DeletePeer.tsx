import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { DeleteResource } from "app/components/DeleteResource";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useTranslation } from "react-i18next";

type DeletePeerProps = {
	isOpen: boolean;
	peer: any;
	profile: Profile;
	onCancel?: () => void;
	onClose?: () => void;
	onDelete?: any;
};

export const DeletePeer = ({ isOpen, peer, profile, onCancel, onClose, onDelete }: DeletePeerProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleDelete = async () => {
		const { coin, network } = peer;

		profile.peers().forget(coin, network, peer);

		await persist();

		onDelete?.(peer);
	};

	return (
		<DeleteResource
			title={t("SETTINGS.MODAL_DELETE_PEER.TITLE")}
			description={t("SETTINGS.MODAL_DELETE_PEER.DESCRIPTION")}
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
