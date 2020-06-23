import { Contact } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Table } from "app/components/Table";
import { ContactListItem } from "domains/contacts/components/ContactListItem";
import React from "react";
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
		<div className="flex justify-end items-center space-x-5">
      {showSearchBar &&
        <>
        	<HeaderSearchBar onSearch={onSearch} />
        	<div className="h-12 my-auto border-l border-1 border-theme-primary-100" />
        </>
      }

			<Button className="whitespace-no-wrap">{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT")}</Button>
		</div>
	);
};

type ContactsProps = {
	contacts?: Contact[];
	onSearch?: any;
	onAddContact?: any;
};

export const Contacts = ({ contacts, onSearch, onAddContact }: ContactsProps) => {
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

  const tableData = contacts.map((contact) => {
    return {
      contact,
      actions: [
        { label: "Send", value: "send" },
        { label: "Edit", value: "edit" },
        { label: "Delete", value: "delete" },
      ],
    };
  });

	return (
		<div className="flex flex-col -m-5 bg-theme-neutral-200 min-h-screen">
			<Breadcrumbs crumbs={crumbs} className="font-semibold p-10" />

			<div className="flex flex-col flex-1 space-y-5">
				<div className="bg-theme-background p-10">
					<Header
						title={t("CONTACTS.CONTACTS_PAGE.TITLE")}
						subtitle={t("CONTACTS.CONTACTS_PAGE.SUBTITLE")}
						extra={
              <ContactsHeaderExtra
                showSearchBar={contacts.length > 0}
                onSearch={onSearch}
                onAddContact={onAddContact}
              />
            }
					/>
				</div>

				<div className="flex flex-1 bg-theme-background p-10">
					{contacts.length === 0 && (
						<div className="flex flex-col items-center justify-center">
							<ContactsBanner className="w-3/5 mb-8" />
							<span>Add your most frequent contacts for fast, easy payments</span>
						</div>
					)}

					{contacts.length > 0 && (
						<div className="w-full">
							<Table columns={listColumns} data={tableData}>
                {(rowData: any) => <ContactListItem {...rowData} />}
							</Table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

Contacts.defaultProps = {
	contacts: [],
};
