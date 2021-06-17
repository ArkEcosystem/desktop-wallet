import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { DeleteResource } from "app/components/DeleteResource";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useTranslation } from "react-i18next";

interface DeleteContactProperties {
	isOpen: boolean;
	contact: Contracts.IContact;
	profile: Contracts.IProfile;
	onCancel?: any;
	onClose?: any;
	onDelete?: any;
}

export const DeleteContact = ({ isOpen, contact, profile, onCancel, onClose, onDelete }: DeleteContactProperties) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleDelete = async () => {
		profile.contacts().forget(contact.id());
		await persist();

		onDelete?.(contact.id());
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
