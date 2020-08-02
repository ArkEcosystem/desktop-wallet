import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { DeleteResource } from "app/components/DeleteResource";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useTranslation } from "react-i18next";

type DeleteContactProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete?: any;
	profile: Profile;
	contactId?: string | null;
};

export const DeleteContact = ({ isOpen, onClose, onCancel, onDelete, profile, contactId }: DeleteContactProps) => {
	const { t } = useTranslation();
	const { persist } = useEnvironmentContext();

	const handleDelete = async () => {
		if (!contactId) return;

		profile.contacts().forget(contactId);
		await persist();

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
