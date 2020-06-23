import { Contact, ContactAddress } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";
const { ContactsBanner } = images.contacts.pages.contacts;
// import { HeaderSearchBar } from "app/components/HeaderSearchBar";

type ContactsHeaderExtraProps = {
	onSearch?: any;
	onAddContact?: any;
};

const ContactsHeaderExtra = ({ onSearch, onAddContact }: ContactsHeaderExtraProps) => {
	const { t } = useTranslation();

	// <HeaderSearchBar onSearch={onSearch} />

	// <div className="h-12 my-auto border-l border-1 border-theme-primary-100" />

	return (
		<div className="flex justify-end items-center space-x-5">
			<Button className="whitespace-no-wrap">{t("CONTACTS.CONTACTS_PAGE.ADD_CONTACT")}</Button>
		</div>
	);
};

type ContactListItemProps = {
	id: string;
	name: string;
	addresses: ContactAddress[];
	starred: boolean;
	actions?: any;
	onAction?: any;
};

const ContactListItem = ({ name, addresses, actions }: ContactListItemProps) => {
	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	return (
		<>
			{addresses.map(({ address, network, avatar }: ContactAddress, index: number) => (
				<tr key={index} className="border-b border-theme-neutral-200">
					<td className="items-center py-4 mt-1">
						{index === 0 && (
							<div className="flex items-center space-x-3">
								<Circle>
									<span className="text-sm font-semibold">{name.slice(0, 2)}</span>
								</Circle>
								<span className="font-semibold">{name}</span>
							</div>
						)}
					</td>
					<td className="text-center py-4">
						<Circle>
							<Icon name={network} />
						</Circle>
					</td>
					<td className="py-4">
						<div className="flex items-center space-x-3">
							<Circle avatarId={avatar} />
							<Address address={address} maxChars={0} />
						</div>
					</td>
					<td className="py-4 text-center text-sm font-bold">
						<span>TODO</span>
					</td>
					<td>
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

	return (
		<div className="flex flex-col -m-5 bg-theme-neutral-200 min-h-screen">
			<Breadcrumbs crumbs={crumbs} className="font-semibold p-10" />

			<div className="flex flex-col flex-1 space-y-10">
				<div className="bg-theme-background p-10">
					<Header
						title={t("CONTACTS.CONTACTS_PAGE.TITLE")}
						subtitle={t("CONTACTS.CONTACTS_PAGE.SUBTITLE")}
						extra={<ContactsHeaderExtra onSearch={onSearch} onAddContact={onAddContact} />}
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
							<Table columns={listColumns} data={contacts}>
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
