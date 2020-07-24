import { Modal } from "app/components/Modal";
import { useEnvironment } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React from "react";
import { useTranslation } from "react-i18next";

type UpdateContactProps = {
	isOpen: boolean;
	contact: any;
	networks: any;
	onClose?: any;
	onCancel?: any;
	onDelete?: any;
	onSave?: any;
	profileId: string;
};

export const UpdateContact = ({
	isOpen,
	contact,
	networks,
	onClose,
	onCancel,
	onDelete,
	onSave,
	profileId,
}: UpdateContactProps) => {
	const { t } = useTranslation();
	const env = useEnvironment();

	const handleSave = () => {
		console.log("on handle save");
		// if (!name) return;
		// const contactId = contact?.id?.();
		//
		// const profile = env?.profiles().findById(profileId);
		// profile?.contacts().update(contactId, {
		// 	name,
		// 	addresses: contactAddresses,
		// });
		// await env?.persist();
		onSave?.();
		// console.log('saving!')
	};

	const handleDelete = async () => {
		const contactId = contact?.id?.();
		if (!contactId) return;

		const profile = env?.profiles().findById(profileId);
		profile?.contacts().forget(contactId);
		await env?.persist();
		onDelete?.(contactId);
	};

	return (
		<Modal title={t("CONTACTS.MODAL_UPDATE_CONTACT.TITLE")} isOpen={isOpen} onClose={onClose}>
			<div className="mt-8">
				<ContactForm
					contact={contact}
					networks={networks}
					onCancel={() => onCancel?.()}
					onDelete={handleDelete}
					onSave={console.log}
				/>
			</div>
		</Modal>
	);
};

UpdateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
