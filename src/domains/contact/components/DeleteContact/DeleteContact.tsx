import { DeleteResource } from "app/components/DeleteResource";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useTranslation } from "react-i18next";

type DeleteContactProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete?: any;
	profileId: string;
	contactId?: string | null;
};

export const DeleteContact = ({ isOpen, onClose, onCancel, onDelete, profileId, contactId }: DeleteContactProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const handleDelete = async () => {
		if (!contactId) return;

		const profile = env?.profiles().findById(profileId);
		profile?.contacts().forget(contactId);
		await env?.persist();

		onDelete?.(contactId);
	};

	return (
		<DeleteResource
			title={t("CONTACTS.MODAL_DELETE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_DELETE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onCancel}
			onDelete={handleDelete}
		/>
	);
};

DeleteContact.defaultProps = {
	isOpen: false,
};
