import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchContactProps = {
	isOpen: boolean;
	contacts: any[];
	onClose?: any;
	onSearch?: any;
};

export const SearchContact = ({ isOpen, contacts, onClose, onSearch }: SearchContactProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
			className: "pl-13",
		},
		{
			Header: t("COMMON.NETWORK"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.ADDRESS"),
			className: "pl-13",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={t("CONTACTS.MODAL_SEARCH_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_SEARCH_CONTACT.DESCRIPTION")}
			placeholder={t("CONTACTS.MODAL_SEARCH_CONTACT.PLACEHOLDER")}
			onClose={onClose}
			onSearch={onSearch}
		>
			<Table columns={columns} data={contacts}>
				{(contact: any) => <ContactListItem contact={contact} variant="condensed" />}
			</Table>
		</SearchResource>
	);
};

SearchContact.defaultProps = {
	contacts: [],
};
