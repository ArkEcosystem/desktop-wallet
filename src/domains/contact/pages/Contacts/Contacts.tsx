import { Coins } from "@arkecosystem/platform-sdk";
import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { CreateContact, DeleteContact, UpdateContact } from "domains/contact/components";
import { ContactListItem } from "domains/contact/components/ContactListItem";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
					<div className="pl-8 my-auto ml-8 h-10 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />
				</>
			)}

			<Button data-testid="contacts__add-contact-btn" className="whitespace-nowrap" onClick={onAddContact}>
				{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT")}
			</Button>
		</div>
	);
};

type ContactsProps = {
	onSearch?: any;
};

export const Contacts = ({ onSearch }: ContactsProps) => {
	const { env, state } = useEnvironmentContext();

	const activeProfile = useActiveProfile();

	const [contacts, setContacts] = useState<Contact[]>([]);

	const [createIsOpen, setCreateIsOpen] = useState(false);

	const [contactAction, setContactAction] = useState<string | null>(null);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

	const [availableNetworks] = useState<Coins.Network[]>(env.availableNetworks());

	const { t } = useTranslation();

	useEffect(() => {
		if (!contactAction) {
			setSelectedContact(null);
		}
	}, [contactAction]);

	useEffect(() => {
		setContacts(activeProfile.contacts().values());
	}, [activeProfile, state]);

	const contactOptions = [
		{ label: t("COMMON.SEND"), value: "send" },
		{ label: t("COMMON.EDIT"), value: "edit" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	const listColumns = [
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.CRYPTOASSET"),
			className: "justify-center",
			minimumWidth: true,
		},
		{
			Header: t("COMMON.ADDRESS"),
		},
		{
			Header: t("COMMON.COPY"),
			minimumWidth: true,
		},
		{
			Header: t("COMMON.ACCOUNT_TYPE"),
			className: "whitespace-nowrap justify-center no-border",
			minimumWidth: true,
		},
		{
			Header: "Actions",
			className: "hidden",
		},
	];

	const handleContactAction = (action: string, contact: Contact) => {
		setContactAction(action);
		setSelectedContact(contact);
	};

	const resetContactAction = () => {
		setContactAction(null);
	};

	return (
		<>
			<Page profile={activeProfile}>
				<Section>
					<Header
						title={t("CONTACTS.CONTACTS_PAGE.TITLE")}
						subtitle={t("CONTACTS.CONTACTS_PAGE.SUBTITLE")}
						extra={
							<ContactsHeaderExtra
								showSearchBar={!!contacts.length}
								onSearch={onSearch}
								onAddContact={() => setCreateIsOpen(true)}
							/>
						}
					/>
				</Section>

				<Section className="flex-1">
					{!contacts.length && (
						<div data-testid="contacts__banner" className="text-center">
							<Image name="ContactsBanner" domain="contacts" height={175} className="mx-auto" />

							<div className="mt-8 text-theme-secondary-text">
								{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT_MESSAGE")}
							</div>
						</div>
					)}

					{!!contacts.length && (
						<div className="w-full" data-testid="ContactList">
							<Table columns={listColumns} data={contacts}>
								{(contact: Contact) => (
									<ContactListItem
										item={contact}
										options={contactOptions}
										onAction={(action: { value: any }) =>
											handleContactAction(action.value, contact)
										}
									/>
								)}
							</Table>
						</div>
					)}
				</Section>
			</Page>

			<CreateContact
				isOpen={createIsOpen}
				profile={activeProfile}
				networks={availableNetworks}
				onCancel={() => setCreateIsOpen(false)}
				onClose={() => setCreateIsOpen(false)}
				onSave={() => setCreateIsOpen(false)}
			/>

			{selectedContact && (
				<>
					<UpdateContact
						isOpen={contactAction === "edit"}
						contact={selectedContact}
						profile={activeProfile}
						networks={availableNetworks}
						onCancel={resetContactAction}
						onClose={resetContactAction}
						onDelete={() => setContactAction("delete")}
						onSave={resetContactAction}
					/>

					<DeleteContact
						isOpen={contactAction === "delete"}
						contact={selectedContact}
						profile={activeProfile}
						onCancel={resetContactAction}
						onClose={resetContactAction}
						onDelete={resetContactAction}
					/>
				</>
			)}
		</>
	);
};
