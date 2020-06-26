import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { Table } from "app/components/Table";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import { SearchBar } from "domains/search/components/SearchBar";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchContactProps = {
	isOpen: boolean;
	contacts: any[];
	onClose?: any;
};

export const SearchContact = ({ isOpen, contacts, onClose }: SearchContactProps) => {
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
		<Modal
			title={t("CONTACTS.MODAL_SEARCH_CONTACT.TITLE")}
			description={t("CONTACTS.MODAL_SEARCH_CONTACT.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			size="4xl"
		>
			<div className="-mx-12">
				<SearchBar placeholder="Search..." className="mt-8">
					<span className="flex items-center">
						<Icon className="text-theme-neutral-500" name="Search" width={20} height={20} />
					</span>
				</SearchBar>
			</div>

			<div className="mt-8">
				<Table columns={columns} data={contacts}>
					{(contact: any) => <ContactListItem contact={contact} variant="condensed" />}
				</Table>
			</div>
		</Modal>
	);
};

SearchContact.defaultProps = {
	contacts: [],
};
