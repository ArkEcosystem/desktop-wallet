import { Profile } from "@arkecosystem/platform-sdk-profiles";
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

	const columns = [
		{
			Header: "ContactAvatar",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.NETWORK"),
			className: "justify-center",
		},
		{
			Header: "Avatar",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.ADDRESS"),
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
			<Table columns={columns} data={profile.contacts().values()}>
				{(contact: any) => (
					<ContactListItem contact={contact} variant="condensed" onAction={onAction} options={options} />
				)}
			</Table>
		</SearchResource>
	);
};
