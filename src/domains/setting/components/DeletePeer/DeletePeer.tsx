import { DeleteResource } from "app/components/DeleteResource";
import React from "react";
import { useTranslation } from "react-i18next";

type DeletePeerProps = {
	isOpen: boolean;
	onCancel?: () => void;
	onClose?: () => void;
	onDelete?: any;
};

export const DeletePeer = ({ isOpen, onCancel, onClose, onDelete }: DeletePeerProps) => {
	const { t } = useTranslation();

	return (
		<DeleteResource
			title={t("CONTACTS.MODAL_DELETE_PEER.TITLE")}
			description={t("CONTACTS.MODAL_DELETE_PEER.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onCancel}
			onDelete={onDelete}
		/>
	);
};

DeletePeer.defaultProps = {
	isOpen: false,
};
