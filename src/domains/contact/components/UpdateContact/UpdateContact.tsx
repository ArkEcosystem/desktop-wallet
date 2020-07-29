import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React from "react";
import { useTranslation } from "react-i18next";

type UpdateContactProps = {
	isOpen: boolean;
	contact: any;
	networks: NetworkData[];
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
	const { env, persist } = useEnvironmentContext();

	const handleSave = async ({ name, addresses }: any) => {
		const profile = env.profiles().findById(profileId);
		await profile?.contacts().update(contact.id, {
			name,
			addresses,
		});
		await persist();
		onSave?.(contact.id);
	};

	const handleDelete = async () => {
		const contactId = contact?.id?.();
		const profile = env.profiles().findById(profileId);
		profile?.contacts().forget(contactId);
		await persist();
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
