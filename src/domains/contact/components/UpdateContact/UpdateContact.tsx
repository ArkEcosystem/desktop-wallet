import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { ContactForm } from "domains/contact/components/ContactForm";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UpdateContactProps {
	isOpen: boolean;
	contact: Contracts.IContact;
	profile: Contracts.IProfile;
	onCancel?: any;
	onClose?: any;
	onDelete?: any;
	onSave?: any;
}

export const UpdateContact = ({
	isOpen,
	contact,
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

	const handleSave = async ({ name, addresses }: any) => {
		await profile.contacts().update(contact.id(), {
			name,
			addresses,
		});
		await persist();
		onSave?.(contact.id());
	};

	const handleChange = (fieldName: string) => {
		const { [fieldName]: _, ...restErrors } = errors;
		setErrors(restErrors);
	};

	return (
		<Modal
			title={t("CONTACTS.MODAL_UPDATE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_UPDATE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<ContactForm
					profile={profile}
					errors={errors}
					contact={contact}
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
};
