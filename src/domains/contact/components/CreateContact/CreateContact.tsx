import { NetworkData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React from "react";
import { useTranslation } from "react-i18next";

type CreateContactProps = {
	isOpen: boolean;
	profile: Profile;
	networks: NetworkData[];
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

export const CreateContact = ({ isOpen, networks, profile, onClose, onCancel, onSave }: CreateContactProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleOnSave = async ({ name, addresses }: any) => {
		const contact = profile.contacts().create(name);

		await profile.contacts().update(contact?.id(), { addresses });
		await persist();

		onSave?.(contact.id());
	};

	return (
		<Modal
			title={t("CONTACTS.MODAL_CREATE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_CREATE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<ContactForm networks={networks} onCancel={onCancel} onSave={handleOnSave} />
			</div>
		</Modal>
	);
};

CreateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
