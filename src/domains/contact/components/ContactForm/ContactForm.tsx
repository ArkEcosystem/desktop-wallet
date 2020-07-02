import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SelectAsset } from "app/components/SelectAsset";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type AddressListItemProps = {
	address: any;
	onRemove: any;
};

const AddressListItem = ({ address, onRemove }: AddressListItemProps) => {
	return (
		<div
			data-testid="contact-form__address-list-item"
			className="flex items-center py-4 border-b border-dashed border-theme-neutral-300"
		>
			<div className="mr-4">
				<div className="flex items-center -space-x-1">
					<Circle className={`-mr-1 ${address.coinClassName}`}>
						<Icon name={address.coin} />
					</Circle>
					<Avatar address={address.address} />
				</div>
			</div>

			<span className="font-semibold">
				<Address address={address.address} maxChars={24} />
			</span>

			<Button
				data-testid="contact-form__remove-address-btn"
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
	addresses: any[];
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
				{addresses.map((address: any, index: number) => (
					<AddressListItem key={index} address={address} onRemove={onRemove} />
				))}
			</div>
		</div>
	);
};

type ContactFormProps = {
	contact?: any;
	assets: any;
	onCancel?: any;
	onDelete?: any;
	onSave: any;
};

export const ContactForm = ({ contact, assets, onCancel, onDelete, onSave }: ContactFormProps) => {
	const [contactAddresses, setContactAddresses] = useState(() => {
		return contact ? contact.addresses() : [];
	});

	const { t } = useTranslation();
	const form = useForm({ mode: "onChange" });
	const { name, network, address } = form.watch();

	useEffect(() => {
		form.setValue("name", contact ? contact.name() : "", !!contact);
		form.register({ name: "network" });
	}, [contact]);

	const handleAddAddress = (network: any, address: string) => {
		setContactAddresses(
			contactAddresses.concat({
				network: network.name,
				address,
				coin: network.icon,
				coinClassName: network.className,
			}),
		);

		form.setValue("network", null);
		form.setValue("address", null);
	};

	const handleRemoveAddress = (address: any) => {
		setContactAddresses(
			contactAddresses.filter((curr: any) => {
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
				<SelectAsset assets={assets} onSelect={(selected: any) => form.setValue("network", selected)} />
				<FormHelperText />
			</FormField>

			<FormField name="address">
				<FormLabel>{t("CONTACTS.CONTACT_FORM.ADDRESS")}</FormLabel>
				<Input data-testid="contact-form__address-input" ref={form.register({})} />
				<FormHelperText />
			</FormField>

			<div className="mt-4">
				<Button
					data-testid="contact-form__add-address-btn"
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

			<div className={`flex w-full ${contact ? "justify-between" : "justify-end"}`}>
				{contact && (
					<Button data-testid="contact-form__delete-btn" onClick={onDelete} color="danger" variant="plain">
						<Icon name="Trash" />
						<span>{t("CONTACTS.CONTACT_FORM.DELETE_CONTACT")}</span>
					</Button>
				)}

				<div className="space-x-3">
					<Button data-testid="contact-form__cancel-btn" variant="plain" onClick={onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button
						data-testid="contact-form__save-btn"
						type="submit"
						variant="solid"
						disabled={!contactAddresses.length}
					>
						{t("COMMON.SAVE")}
					</Button>
				</div>
			</div>
		</Form>
	);
};

ContactForm.defaultProps = {
	assets: [],
};
