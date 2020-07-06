import { images } from "app/assets/images";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
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
	assets: any[];
	onSearch?: any;
};

export const Contacts = ({ contacts, assets, onSearch }: ContactsProps) => {
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
		{
			Header: "Account Type",
			className: "justify-center",
		},
	];

	const handleOnSave = () => {
		setCreateIsOpen(false);
	};

	return (
		<div data-testid="contacts" className="flex flex-col min-h-screen -m-5 bg-theme-neutral-200">
			<Breadcrumbs crumbs={crumbs} className="p-5 pl-10 font-semibold" />

			<div className="flex flex-col flex-1 space-y-5">
				<div className="px-10 py-16 bg-theme-background">
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
				</div>

				<div className="flex flex-1 p-10 bg-theme-background">
					{contacts.length === 0 && (
						<div
							data-testid="contacts__banner"
							className="flex flex-col items-center justify-center w-full"
						>
							<div className="mx-auto">
								<ContactsBanner height={175} />
							</div>
							<div className="mt-8">
								<span className="text-theme-neutral-dark">
									{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT_MESSAGE")}
								</span>
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
				</div>
			</div>

			<CreateContact
				isOpen={createIsOpen}
				assets={assets}
				onCancel={() => setCreateIsOpen(false)}
				onClose={() => setCreateIsOpen(false)}
				onSave={handleOnSave}
			/>
		</div>
	);
};

Contacts.defaultProps = {
	contacts: [],
	assets: [],
};
