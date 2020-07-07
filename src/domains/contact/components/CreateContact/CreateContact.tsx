import { Modal } from "app/components/Modal";
import { ContactForm } from "domains/contact/components/ContactForm";
import React from "react";
import { useTranslation } from "react-i18next";

type CreateContactProps = {
	isOpen: boolean;
	networks: any;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

export const CreateContact = ({ isOpen, networks, onClose, onCancel, onSave }: CreateContactProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("CONTACTS.MODAL_CREATE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_CREATE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<ContactForm networks={networks} onCancel={onCancel} onSave={onSave} />
			</div>
		</Modal>
	);
};

CreateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
