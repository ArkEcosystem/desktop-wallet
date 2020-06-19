import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Select } from "app/components/Select";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateContactProps = {
	isOpen: boolean;
	networks: any;
	addresses: any;
	onClose?: any;
	onCancel?: any;
	onSave: any;
};

export const CreateContact = ({ isOpen, networks, addresses, onClose, onCancel, onSave }: CreateContactProps) => {
	const form = useForm({ mode: "onChange" });

	const { t } = useTranslation();

	return (
		<Modal
			title={t("CONTACTS.MODAL_CREATE_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_CREATE_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<Form context={form} onSubmit={onSave}>
					<FormField name="name">
						<FormLabel>{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.NAME")}</FormLabel>
						<Input ref={form.register({ required: t("COMMON.VALIDATION.REQUIRED").toString() })} />
						<FormHelperText />
					</FormField>

					<FormField name="network">
						<FormLabel>{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.NETWORK")}</FormLabel>
						<Select placeholder="Select network..." ref={form.register({})}>
							{networks &&
								networks.map((network: any, index: number) => (
									<option key={index} value={network.icon}>
										{network.label}
									</option>
								))}
						</Select>
						<FormHelperText />
					</FormField>

					<FormField name="address">
						<FormLabel>{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.ADDRESS")}</FormLabel>
						<Input ref={form.register({})} />
						<FormHelperText />
					</FormField>

					<div className="mt-4">
						<Button variant="plain" className="w-full">
							{t("CONTACTS.MODAL_CREATE_CONTACT.ADD_ADDRESS")}
						</Button>
					</div>

					{addresses && addresses.length > 0 && (
						<div className="group">
							<span className="inline-block text-sm font-semibold transition-colors duration-100 group-hover:text-theme-primary text-theme-neutral-dark">
								{t("CONTACTS.MODAL_CREATE_CONTACT.FORM.ADDRESSES")}
							</span>

							{addresses.map((address: any, key: number) => (
								<div
									key={key}
									className="flex items-center py-4 border-b border-dashed border-theme-neutral-300"
								>
									<div className="mr-4">
										<Circle className="-mr-2">
											<Icon name={address.coin} />
										</Circle>
										<Circle avatarId={address.avatar} />
									</div>

									<span className="font-semibold">
										<Address address={address.address} maxChars={24} />
									</span>

									<Button size="icon" className="flex items-center ml-auto" variant="plain">
										<Icon name="Trash" />
									</Button>
								</div>
							))}
						</div>
					)}

					<div className="flex justify-end mt-8 space-x-3">
						<Button variant="plain" onClick={onCancel}>
							{t("COMMON.CANCEL")}
						</Button>

						<Button type="submit" variant="solid" disabled={!form.formState.isValid}>
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
	addresses: [],
};
