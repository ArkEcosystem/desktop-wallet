import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import { CreateContact } from "domains/contact/components/CreateContact";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const { ContactsBanner } = images.contacts.pages.contacts;

type ContactsHeaderExtraProps = {
	showSearchBar: boolean;
	onSearch?: any;
	onAddContact?: any;
};

const ContactsHeaderExtra = ({ showSearchBar, onSearch, onAddContact }: ContactsHeaderExtraProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex justify-end items-top">
			{showSearchBar && (
				<>
					<HeaderSearchBar onSearch={onSearch} />
					<div className="h-10 pl-8 my-auto ml-8 border-l border-theme-neutral-200" />
				</>
			)}

			<Button data-testid="contacts__add-contact-btn" className="whitespace-no-wrap" onClick={onAddContact}>
				{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT")}
			</Button>
		</div>
	);
};

type ContactsProps = {
	contacts: any[];
	networks: any[];
	onSearch?: any;
};

export const Contacts = ({ contacts, networks, onSearch }: ContactsProps) => {
	const [createIsOpen, setCreateIsOpen] = useState(false);

	const { t } = useTranslation();

	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	const listColumns = [
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
		{
			Header: t("COMMON.ACCOUNT_TYPE"),
			className: "justify-center",
		},
	];

	const handleOnSave = () => {
		setCreateIsOpen(false);
	};

	return (
		<>
			<Page crumbs={crumbs}>
				<Section>
					<Header
						title={t("CONTACTS.CONTACTS_PAGE.TITLE")}
						subtitle={t("CONTACTS.CONTACTS_PAGE.SUBTITLE")}
						extra={
							<ContactsHeaderExtra
								showSearchBar={contacts.length > 0}
								onSearch={onSearch}
								onAddContact={() => setCreateIsOpen(true)}
							/>
						}
					/>
				</Section>

				<Section className="flex-1">
					{contacts.length === 0 && (
						<div data-testid="contacts__banner" className="text-center">
							<ContactsBanner height={175} className="mx-auto" />

							<div className="mt-8 text-theme-neutral-dark">
								{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT_MESSAGE")}
							</div>
						</div>
					)}

					{contacts.length > 0 && (
						<div className="w-full">
							<Table columns={listColumns} data={contacts}>
								{(contact: any) => <ContactListItem contact={contact} />}
							</Table>
						</div>
					)}
				</Section>
			</Page>

			<CreateContact
				isOpen={createIsOpen}
				networks={networks}
				onCancel={() => setCreateIsOpen(false)}
				onClose={() => setCreateIsOpen(false)}
				onSave={handleOnSave}
			/>
		</>
	);
};

Contacts.defaultProps = {
	contacts: [],
	networks: [],
};
