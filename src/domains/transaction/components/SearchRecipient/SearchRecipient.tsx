import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { AvatarWrapper } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type Recipient = {
	id: string;
	address: string;
	alias?: string;
	avatar: string;
	type: string;
};

type RecipientListItemProps = {
	recipient: Recipient;
	translations: any;
	onAction: (address: string) => void;
};

const RecipientListItem = ({ recipient, translations, onAction }: RecipientListItemProps) => (
	<TableRow key={recipient.id} border>
		<TableCell variant="start" innerClassName="space-x-4">
			<AvatarWrapper size="lg" noShadow>
				<img
					src={`data:image/svg+xml;utf8,${recipient.avatar}`}
					title={recipient.alias}
					alt={recipient.alias}
				/>
				{recipient.alias && (
					<span className="absolute text-sm font-semibold text-theme-background">
						{recipient.alias.slice(0, 2)?.toUpperCase()}
					</span>
				)}
			</AvatarWrapper>
			<Address address={recipient.address} maxChars={24} />
		</TableCell>

		<TableCell>
			<span data-testid="RecipientListItem__name">{recipient.alias}</span>
		</TableCell>

		<TableCell>
			<span data-testid="RecipientListItem__type">
				{recipient.type === "wallet" ? translations("COMMON.MY_WALLET") : translations("COMMON.CONTACT")}
			</span>
		</TableCell>

		<TableCell variant="end" innerClassName="justify-end">
			<Button
				data-testid="RecipientListItem__select-button"
				variant="plain"
				onClick={() => onAction(recipient.address)}
			>
				{translations("COMMON.SELECT")}
			</Button>
		</TableCell>
	</TableRow>
);

type SearchRecipientProps = {
	title?: string;
	description?: string;
	isOpen: boolean;
	profile: Profile;
	onClose?: any;
	onSearch?: any;
	onAction: (address: string) => void;
};

export const SearchRecipient = ({
	title,
	description,
	profile,
	isOpen,
	onClose,
	onSearch,
	onAction,
}: SearchRecipientProps) => {
	const { t } = useTranslation();

	const contacts = profile.contacts().values();
	const wallets = profile.wallets().values();

	const availableData: Recipient[] = [];

	contacts.map((contact) =>
		availableData.push(
			...contact
				.addresses()
				.values()
				.map((contactAddress) => ({
					id: contactAddress.id(),
					address: contactAddress.address(),
					alias: contact.name(),
					avatar: contactAddress.avatar(),
					type: "contact",
				})),
		),
	);

	wallets.map((wallet) =>
		availableData.push({
			id: wallet.id(),
			address: wallet.address(),
			alias: wallet.alias(),
			avatar: wallet.avatar(),
			type: "wallet",
		}),
	);

	const columns = [
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "address",
			className: "ml-15",
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "alias",
		},
		{
			Header: t("COMMON.TYPE"),
			accessor: "type",
			className: "no-border",
		},
		{
			Header: "Actions",
			className: "hidden no-border",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={title || t("TRANSACTION.MODAL_SEARCH_RECIPIENT.TITLE")}
			description={description || t("TRANSACTION.MODAL_SEARCH_RECIPIENT.DESCRIPTION")}
			placeholder={t("TRANSACTION.MODAL_SEARCH_RECIPIENT.PLACEHOLDER")}
			onClose={onClose}
			onSearch={onSearch}
		>
			<Table columns={columns} data={availableData}>
				{(recipient: Recipient) => (
					<RecipientListItem recipient={recipient} translations={t} onAction={onAction} />
				)}
			</Table>
		</SearchResource>
	);
};
