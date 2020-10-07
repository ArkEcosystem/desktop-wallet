import { Contact, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import { Option } from "domains/contact/components/ContactListItem/ContactListItem.models";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchContactProps = {
	title?: string;
	description?: string;
	isOpen: boolean;
	profile: Profile;
	options?: any[];
	onClose?: any;
	onSearch?: any;
	onAction?: (action: Option, address: any) => void;
};

export const SearchContact = ({
	isOpen,
	profile,
	onClose,
	onSearch,
	onAction,
	options,
	title,
	description,
}: SearchContactProps) => {
	const { t } = useTranslation();
	const contacts = profile.contacts().values();
	const wallets = profile.wallets().values();
	const availableData: { item: Contact | ReadWriteWallet; type: string }[] = [];

	contacts.map((contact) => availableData.push({ item: contact, type: "contact" }));
	wallets.map((wallet) => availableData.push({ item: wallet, type: "wallet" }));

	const columns = [
		{
			Header: "ContactAvatar",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.ADDRESS"),
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.TYPE"),
			accessor: "type",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={title || t("CONTACTS.MODAL_SEARCH_CONTACT.TITLE")}
			description={description || t("CONTACTS.MODAL_SEARCH_CONTACT.DESCRIPTION")}
			placeholder={t("CONTACTS.MODAL_SEARCH_CONTACT.PLACEHOLDER")}
			onClose={onClose}
			onSearch={onSearch}
		>
			<Table columns={columns} data={availableData}>
				{(data: any) => (
					<ContactListItem
						contact={data.item}
						type={data.type}
						variant="condensed"
						onAction={onAction}
						options={options}
					/>
				)}
			</Table>
		</SearchResource>
	);
};
