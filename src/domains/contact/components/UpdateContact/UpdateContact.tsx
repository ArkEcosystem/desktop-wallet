import { Coins } from "@arkecosystem/platform-sdk";
import { Contact, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type UpdateContactProps = {
	isOpen: boolean;
	contact: Contact;
	profile: Profile;
	networks: Coins.Network[];
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
	const [errors, setErrors] = useState<any>({});

	const { t } = useTranslation();
	const { persist } = useEnvironmentContext();

	useEffect(() => setErrors({}), [isOpen]);

	const formatError = (errorMessage: string, name: string) => {
		switch (true) {
			case errorMessage.includes("already exists"):
				return {
					name: t("CONTACTS.VALIDATION.CONTACT_NAME_EXISTS", {
						name,
					}),
				};
		}
	};

	const handleSave = async ({ name, addresses }: any) => {
		try {
			await profile.contacts().update(contact.id(), {
				name,
				addresses,
			});
			await persist();
			onSave?.(contact.id());
		} catch (e) {
			setErrors(formatError(e.toString(), name));
		}
	};

	const handleChange = (fieldName: string) => {
		const { [fieldName]: _, ...restErrors } = errors;
		setErrors(restErrors);
	};

	return (
		<Modal title={t("CONTACTS.MODAL_UPDATE_CONTACT.TITLE")} isOpen={isOpen} onClose={onClose}>
			<div className="mt-8">
				<ContactForm
					errors={errors}
					contact={contact}
					networks={networks}
					onCancel={() => onCancel?.()}
					onDelete={onDelete}
					onChange={handleChange}
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
