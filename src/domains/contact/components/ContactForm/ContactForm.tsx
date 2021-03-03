import { Coins } from "@arkecosystem/platform-sdk";
import { Contact, ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel, SubForm } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputAddress, InputDefault } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type AddressListItemProps = {
	address: any;
	onRemove: any;
};

const AddressListItem = ({ address, onRemove }: AddressListItemProps) => (
	<div
		data-testid="contact-form__address-list-item"
		className="flex items-center py-4 border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800"
	>
		<div className="mr-4">
			<div className="flex items-center -space-x-1">
				<NetworkIcon coin={address.coin} network={address.network} size="lg" />
				<Avatar address={address.address} size="lg" />
			</div>
		</div>

		<span className="font-semibold">
			<Address address={address.address} maxChars={24} />
		</span>

		<Button
			data-testid="contact-form__remove-address-btn"
			size="icon"
			className="flex items-center ml-auto"
			variant="danger"
			onClick={() => onRemove(address)}
		>
			<Icon name="Trash" />
		</Button>
	</div>
);

type AddressListProps = {
	addresses: any[];
	onRemove: any;
};

const AddressList = ({ addresses, onRemove }: AddressListProps) => {
	const { t } = useTranslation();

	return (
		<div className="group">
			<span className="inline-block text-sm font-semibold transition-colors duration-100 group-hover:text-theme-primary-600 text-theme-secondary-text">
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
	contact?: Contact;
	networks: Coins.Network[];
	onCancel?: any;
	onChange?: any;
	onDelete?: any;
	onSave: any;
	errors?: any;
};

export const ContactForm = ({ contact, networks, onChange, onCancel, onDelete, onSave, errors }: ContactFormProps) => {
	const nameMaxLength = 42;

	const [addresses, setAddresses] = useState(() =>
		contact
			? contact
					.addresses()
					.values()
					.map((address: ContactAddress) => ({
						network: address.network(),
						address: address.address(),
						name: address.name(),
						coin: address.coin(),
					}))
			: [],
	);

	const { env } = useEnvironmentContext();
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { register, setError, setValue, watch } = form;
	const { name, network, address } = watch();

	useEffect(() => {
		register({ name: "network" });
	}, [register]);

	useEffect(() => {
		for (const [field, message] of Object.entries(errors)) {
			setError(field, { type: "manual", message: message as string });
		}
	}, [errors, setError]);

	const handleAddAddress = async () => {
		const addressExists = addresses.some((addr) => addr.address === address);
		if (addressExists) {
			return setError("address", {
				type: "manual",
				message: t("CONTACTS.VALIDATION.ADDRESS_EXISTS", { address }),
			});
		}

		const instance: Coins.Coin = await env.coin(network.coin(), network.id());
		const isValidAddress: boolean = await instance.identity().address().validate(address);

		if (!isValidAddress) {
			return setError("address", { type: "manual", message: t("CONTACTS.VALIDATION.ADDRESS_IS_INVALID") });
		}

		setAddresses(
			addresses.concat({
				network: network.id(),
				address,
				name: address,
				coin: network.coin(),
			}),
		);

		setValue("network", null);
		setValue("address", null);
	};

	const handleRemoveAddress = (item: any) => {
		setAddresses(
			addresses.filter((curr: any) => !(curr.address === item.address && curr.network === item.network)),
		);
	};

	const handleSelectNetwork = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	const isNameValid = useMemo(() => !!name?.trim() && !form.errors?.name, [name, form.errors]);

	return (
		<Form
			data-testid="contact-form"
			context={form}
			onSubmit={() =>
				onSave({
					name,
					addresses,
				})
			}
		>
			<FormField name="name">
				<FormLabel>{t("CONTACTS.CONTACT_FORM.NAME")}</FormLabel>
				<InputDefault
					data-testid="contact-form__name-input"
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("CONTACTS.CONTACT_FORM.NAME"),
						}).toString(),
						maxLength: {
							message: t("COMMON.VALIDATION.MAX_LENGTH", {
								field: t("CONTACTS.CONTACT_FORM.NAME"),
								maxLength: nameMaxLength,
							}),
							value: nameMaxLength,
						},
					})}
					onChange={() => onChange?.("name", name)}
					defaultValue={contact?.name?.()}
				/>
			</FormField>

			<SubForm>
				<FormField name="network">
					<FormLabel>{t("CONTACTS.CONTACT_FORM.CRYPTOASSET")}</FormLabel>
					<SelectNetwork
						id="ContactForm__network"
						networks={networks}
						onSelect={handleSelectNetwork}
						selected={network}
					/>
				</FormField>

				<FormField name="address" data-testid="ContactForm__address">
					<FormLabel>{t("CONTACTS.CONTACT_FORM.ADDRESS")}</FormLabel>

					<InputAddress
						useDefaultRules={false}
						registerRef={register}
						onChange={() => onChange?.("address", address)}
						data-testid="contact-form__address-input"
					/>
				</FormField>

				<div className="mt-4">
					<Button
						data-testid="contact-form__add-address-btn"
						variant="secondary"
						className="w-full"
						disabled={!network || !address}
						onClick={handleAddAddress}
					>
						{t("CONTACTS.CONTACT_FORM.ADD_ADDRESS")}
					</Button>
				</div>
			</SubForm>

			{addresses && addresses.length > 0 && <AddressList addresses={addresses} onRemove={handleRemoveAddress} />}

			<div className={`flex w-full ${contact ? "justify-between" : "justify-end"}`}>
				{contact && (
					<Button data-testid="contact-form__delete-btn" onClick={onDelete} variant="danger">
						<Icon name="Trash" />
						<span>{t("CONTACTS.CONTACT_FORM.DELETE_CONTACT")}</span>
					</Button>
				)}

				<div className="space-x-3">
					<Button data-testid="contact-form__cancel-btn" variant="secondary" onClick={onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button
						data-testid="contact-form__save-btn"
						type="submit"
						variant="primary"
						disabled={addresses.length === 0 || !isNameValid}
					>
						{t("COMMON.SAVE")}
					</Button>
				</div>
			</div>
		</Form>
	);
};

ContactForm.defaultProps = {
	networks: [],
	errors: {},
};
