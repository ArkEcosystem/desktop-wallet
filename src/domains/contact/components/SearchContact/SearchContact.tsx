import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import { Option } from "domains/contact/components/ContactListItem/ContactListItem.models";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchContactProps = {
	isOpen: boolean;
	contacts: any[];
	options?: any[];
	onClose?: any;
	onSearch?: any;
	onAction?: (action: Option, address: any) => void;
};

export const SearchContact = ({ isOpen, contacts, onClose, onSearch, onAction, options }: SearchContactProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: "Nickname",
			accessor: "name",
			className: "pl-13",
		},
		{
			Header: "Network",
			className: "justify-center",
		},
		{
			Header: "Address",
			className: "pl-13",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={t("CONTACTS.MODAL_SEARCH_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_SEARCH_CONTACT.DESCRIPTION")}
			placeholder="Search..."
			onClose={onClose}
			onSearch={onSearch}
		>
			<Table columns={columns} data={contacts}>
				{(contact: any) => (
					<ContactListItem contact={contact} variant="condensed" onAction={onAction} options={options} />
				)}
			</Table>
		</SearchResource>
	);
};

SearchContact.defaultProps = {
	contacts: [],
};
