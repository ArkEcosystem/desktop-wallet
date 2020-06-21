import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Select } from "app/components/Select";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type AddressListItemProps = {
	address: ContactAddress;
	onRemove: any;
};

const AddressListItem = ({ address, onRemove }: AddressListItemProps) => {
	return (
		<div
			data-testid="contact-form__address-list-item"
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

			<Button
				data-testid="contact-form__remove-address-button"
				size="icon"
				className="flex items-center ml-auto"
				variant="plain"
				onClick={() => onRemove(address)}
			>
				<Icon name="Trash" />
			</Button>
		</div>
	);
};

type AddressListProps = {
	addresses: ContactAddress[];
	onRemove: any;
};

const AddressList = ({ addresses, onRemove }: AddressListProps) => {
	const { t } = useTranslation();

	return (
		<div className="group">
			<span className="inline-block text-sm font-semibold transition-colors duration-100 group-hover:text-theme-primary text-theme-neutral-dark">
				{t("CONTACTS.CONTACT_FORM.ADDRESSES")}
			</span>

			<div data-testid="contact-form__address-list">
				{addresses.map((address: ContactAddress, index: number) => (
					<AddressListItem key={index} address={address} onRemove={onRemove} />
				))}
			</div>
		</div>
	);
};

type ContactFormProps = {
	contact?: any;
	networks: any;
	onCancel: any;
	onSave: any;
};

export const ContactForm = ({ contact, networks, onCancel, onSave }: ContactFormProps) => {
	const [contactAddresses, setContactAddresses] = useState(() => {
		return contact ? contact.addresses() : [];
	});

	useEffect(() => {
		form.setValue("name", contact ? contact.name() : "", !!contact);
	}, [contact]);

	const form = useForm({ mode: "onChange" });
	const { name, network, address } = form.watch();

	const { t } = useTranslation();

	const handleAddAddress = (network: string, address: string) => {
		setContactAddresses(
			contactAddresses.concat({
				network,
				address,
				coin: "xxx", // TODO
			}),
		);

		form.setValue("network", null);
		form.setValue("address", null);
	};

	const handleRemoveAddress = (address: ContactAddress) => {
		setContactAddresses(
			contactAddresses.filter((curr) => {
				return !(curr.address === address.address && curr.network === address.network);
			}),
		);
	};

	return (
		<Form
			data-testid="contact-form"
			context={form}
			onSubmit={() =>
				onSave({
					name,
					contactAddresses,
				})
			}
		>
			<FormField name="name">
				<FormLabel>{t("CONTACTS.CONTACT_FORM.NAME")}</FormLabel>
				<Input
					data-testid="contact-form__name-input"
					ref={form.register({ required: t("COMMON.VALIDATION.REQUIRED").toString() })}
				/>
				<FormHelperText />
			</FormField>

			<FormField name="network">
				<FormLabel>{t("CONTACTS.CONTACT_FORM.NETWORK")}</FormLabel>
				<Select
					data-testid="contact-form__network-select"
					placeholder="Select network..."
					ref={form.register({})}
				>
					{networks &&
						networks.map((network: any, index: number) => (
							<option data-testid="contact-form__network-option" key={index} value={network.value}>
								{network.label}
							</option>
						))}
				</Select>
				<FormHelperText />
			</FormField>

			<FormField name="address">
				<FormLabel>{t("CONTACTS.CONTACT_FORM.ADDRESS")}</FormLabel>
				<Input data-testid="contact-form__address-input" ref={form.register({})} />
				<FormHelperText />
			</FormField>

			<div className="mt-4">
				<Button
					data-testid="contact-form__add-address-button"
					variant="plain"
					className="w-full"
					disabled={!network || !address}
					onClick={() => handleAddAddress(network, address)}
				>
					{t("CONTACTS.CONTACT_FORM.ADD_ADDRESS")}
				</Button>
			</div>

			{contactAddresses && contactAddresses.length > 0 && (
				<AddressList addresses={contactAddresses} onRemove={handleRemoveAddress} />
			)}

			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="plain" onClick={onCancel}>
					{t("COMMON.CANCEL")}
				</Button>

				<Button
					data-testid="contact-form__save-button"
					type="submit"
					variant="solid"
					disabled={!form.formState.isValid || !contactAddresses.length}
				>
					{t("COMMON.SAVE")}
				</Button>
			</div>
		</Form>
	);
};

ContactForm.defaultProps = {
	networks: [],
};
