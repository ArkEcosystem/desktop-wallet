import { Contact, ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
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

type ContactListItemProps = {
	contact: Contact;
	actions?: any;
	onAction?: any;
};

const ContactListItem = ({
  contact,
  actions,
  onAction,
}: ContactListItemProps) => {
	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	return (
		<>
			{contact.addresses().map(({ address, avatar, coin, network }: ContactAddress, index: number) => (
				<tr key={index}>
          <td className={`text-center ${index === contact.addresses().length - 1 ? "border-b border-dashed border-theme-neutral-200" : ""}`}>
						{index === 0 && (
							<div className="flex items-center space-x-3">
								<Circle className={`bg-color-${coin}-${network}`}>
									<span className={`text-sm font-semibold text-color-${coin}-${network}`}>
                    {contact.name().slice(0, 2)}
                  </span>
								</Circle>
								<span className="font-semibold">{contact.name()}</span>
							</div>
						)}
					</td>
					<td className={`text-center ${index === contact.addresses().length - 1 ? "border-b border-dashed border-theme-neutral-200" : ""}`}>
						<Circle>
							<Icon name={coin} />
						</Circle>
					</td>
					<td className="py-6 border-b border-dashed border-theme-neutral-200">
						<div className="flex items-center space-x-3">
							<Circle avatarId={avatar} />
							<Address address={address} maxChars={0} />
						</div>
					</td>
          <td className="text-center text-sm font-bold border-b border-dashed border-theme-neutral-200 space-x-2">
            <span>TODO</span>
          </td>
          {/*
          {typeIcons && (
            <td className="text-center text-sm font-bold border-b border-dashed border-theme-neutral-200 space-x-2">
              {typeIcons.map((type: string, index: number) => {
                return (
                  <div key={index} className="inline-block">
                    <Icon name={type} />
                  </div>
                );
              })}
            </td>
          )}
          */}
					<td className="border-b border-dashed border-theme-neutral-200">
						{actions && actions.length && (
							<Dropdown
								toggleContent={
									<div className="float-right">
										<Button variant="plain" size="icon">
											<Icon name="Settings" width={20} height={20} />
										</Button>
									</div>
								}
								options={actions}
								onSelect={onDropdownAction}
							/>
						)}
					</td>
				</tr>
			))}
		</>
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
