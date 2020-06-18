import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Select } from "app/components/Select";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateContactProps = {
	isOpen: boolean;
	networks: any;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

export const CreateContact = ({ isOpen, networks, onClose, onCancel, onSave }: CreateContactProps) => {
	const methods = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	return (
		<Modal
			title={t("CONTACTS.MODAL_CREATE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_CREATE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<Form context={methods} onSubmit={onSave}>
					<FormField name="name">
						<FormLabel>{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.NAME")}</FormLabel>
						<Input ref={methods.register({ required: t("COMMON.VALIDATION.REQUIRED") })} />
						<FormHelperText />
					</FormField>

					<FormField name="network">
						<FormLabel>{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.NETWORK")}</FormLabel>
						<Select
							placeholder="Select network..."
							name="network"
							ref={methods.register({ required: t("COMMON.VALIDATION.REQUIRED") })}
						>
							{networks &&
								networks.map((network: any, index: number) => (
									<option key={index} value={network.value}>
										{network.label}
									</option>
								))}
						</Select>
						<FormHelperText />
					</FormField>

					<FormField name="address">
						<FormLabel>{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.ADDRESS")}</FormLabel>
						<Input ref={methods.register({ required: t("COMMON.VALIDATION.REQUIRED") })} />
						<FormHelperText />
					</FormField>

					<div className="flex mt-8 space-x-2 justify-end">
						<Button color="primary" variant="plain" onClick={onCancel}>
							{t("COMMON.CANCEL")}
						</Button>

						<Button type="submit" color="primary" variant="solid">
							{t("COMMON.SAVE")}
						</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};

CreateContact.defaultProps = {
	isOpen: false,
	networks: [],
};
