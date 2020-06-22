import { Modal } from "app/components/Modal";
import { ContactForm } from "domains/contacts/components/ContactForm";
import React from "react";
import { useTranslation } from "react-i18next";

type UpdateContactProps = {
	isOpen: boolean;
	contact: any;
	networks: any;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

export const UpdateContact = ({ isOpen, contact, networks, onClose, onCancel, onSave }: UpdateContactProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("CONTACTS.MODAL_UPDATE_CONTACT.TITLE")} isOpen={isOpen} onClose={onClose}>
			<div className="mt-8">
				<ContactForm contact={contact} networks={networks} onCancel={onCancel} onSave={onSave} />
			</div>
		</Modal>
	);
};

UpdateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
