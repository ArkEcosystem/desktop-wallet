import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type CreateContactProps = {
	isOpen: boolean;
	profile: Profile;
	networks: Coins.Network[];
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

export const CreateContact = ({ isOpen, networks, profile, onClose, onCancel, onSave }: CreateContactProps) => {
	const { t } = useTranslation();
	const [errors, setErrors] = useState<any>({});

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

	const handleOnSave = async ({ name, addresses }: any) => {
		try {
			const contact = profile.contacts().create(name);
			await profile.contacts().update(contact?.id(), { addresses });
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
		<Modal
			title={t("CONTACTS.MODAL_CREATE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_CREATE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<ContactForm
					onChange={handleChange}
					networks={networks}
					onCancel={onCancel}
					onSave={handleOnSave}
					errors={errors}
				/>
			</div>
		</Modal>
	);
};

CreateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
