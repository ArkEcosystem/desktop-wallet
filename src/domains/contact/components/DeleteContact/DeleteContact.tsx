import { DeleteResource } from "app/components/DeleteResource";
import React from "react";
import { useTranslation } from "react-i18next";

type DeleteContactProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete?: any;
};

export const DeleteContact = ({ isOpen, onClose, onCancel, onDelete }: DeleteContactProps) => {
	const { t } = useTranslation();

	return (
		<DeleteResource
			title={t("CONTACTS.MODAL_DELETE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_DELETE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onCancel}
			onDelete={onDelete}
		/>
	);
};

DeleteContact.defaultProps = {
	isOpen: false,
};
