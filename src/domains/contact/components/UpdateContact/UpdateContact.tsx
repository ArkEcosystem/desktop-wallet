import { Contact, NetworkData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React from "react";
import { useTranslation } from "react-i18next";

type UpdateContactProps = {
	isOpen: boolean;
	contact: Contact;
	profile: Profile;
	networks: NetworkData[];
	onCancel?: any;
	onClose?: any;
	onDelete?: any;
	onSave?: any;
};

export const UpdateContact = ({
	isOpen,
	contact,
	networks,
	onClose,
	onCancel,
	onDelete,
	onSave,
	profile,
}: UpdateContactProps) => {
	const { t } = useTranslation();
	const { persist } = useEnvironmentContext();

	const handleSave = async ({ name, addresses }: any) => {
		await profile.contacts().update(contact.id(), {
			name,
			addresses,
		});
		await persist();

		onSave?.(contact.id());
	};

	return (
		<Modal title={t("CONTACTS.MODAL_UPDATE_CONTACT.TITLE")} isOpen={isOpen} onClose={onClose}>
			<div className="mt-8">
				<ContactForm
					contact={contact}
					networks={networks}
					onCancel={() => onCancel?.()}
					onDelete={onDelete}
					onSave={handleSave}
				/>
			</div>
		</Modal>
	);
};

UpdateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
