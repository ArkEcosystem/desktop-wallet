import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import { useActiveProfile } from "app/hooks/env";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import { CreateContact } from "domains/contact/components/CreateContact";
import { DeleteContact } from "domains/contact/components/DeleteContact";
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
	networks: NetworkData[];
	onSearch?: any;
};

export const Contacts = ({ networks, onSearch }: ContactsProps) => {
	const [createIsOpen, setCreateIsOpen] = useState(false);
	const [contactToDelete, setContactToDelete] = useState(null);

	const activeProfile = useActiveProfile();
	const contacts = activeProfile?.contacts();

	const hasContacts = !!activeProfile?.contacts().count();

	const { t } = useTranslation();

	const contactOptions = [
		{ label: t("COMMON.SEND"), value: "send" },
		{ label: t("COMMON.EDIT"), value: "edit" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

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

	const handleContactAction = (action: any, contact: any) => {
		if (action === "delete") {
			setContactToDelete(contact.id());
		}
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
								showSearchBar={hasContacts}
								onSearch={onSearch}
								onAddContact={() => setCreateIsOpen(true)}
							/>
						}
					/>
				</Section>

				<Section className="flex-1">
					{!hasContacts && (
						<div data-testid="contacts__banner" className="text-center">
							<ContactsBanner height={175} className="mx-auto" />

							<div className="mt-8 text-theme-neutral-dark">
								{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT_MESSAGE")}
							</div>
						</div>
					)}

					{hasContacts && (
						<div className="w-full" data-testid="ContactList">
							<Table columns={listColumns} data={contacts!.values()}>
								{(contact: any) => (
									<ContactListItem
										contact={contact}
										options={contactOptions}
										onAction={(action) => handleContactAction(action.value, contact)}
									/>
								)}
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

			<DeleteContact
				profileId={activeProfile?.id() as string}
				contactId={contactToDelete}
				isOpen={!!contactToDelete}
				onClose={() => setContactToDelete(null)}
				onCancel={() => setContactToDelete(null)}
				onDelete={() => setContactToDelete(null)}
			/>
		</>
	);
};

Contacts.defaultProps = {
	contacts: [],
	networks: [],
};
