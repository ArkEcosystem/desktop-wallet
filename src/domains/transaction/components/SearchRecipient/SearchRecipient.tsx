import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { AvatarWrapper } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Modal } from "app/components/Modal";
import { Table } from "app/components/Table";
import { TableCell, TableRow } from "app/components/Table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Recipient = {
	id: string;
	address: string;
	alias?: string;
	network?: string;
	avatar: string;
	type: string;
};

type RecipientListItemProps = {
	recipient: Recipient;
	onAction: (address: string) => void;
};

const RecipientListItem = ({ recipient, onAction }: RecipientListItemProps) => {
	const { t } = useTranslation();

	return (
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
					{recipient.type === "wallet" ? t("COMMON.MY_WALLET") : t("COMMON.CONTACT")}
				</span>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				<Button
					data-testid="RecipientListItem__select-button"
					variant="secondary"
					onClick={() => onAction(recipient.address)}
				>
					{t("COMMON.SELECT")}
				</Button>
			</TableCell>
		</TableRow>
	);
};

type SearchRecipientProps = {
	title?: string;
	description?: string;
	network?: Network;
	isOpen: boolean;
	profile: Profile;
	onClose?: () => void;
	onAction: (address: string) => void;
};

export const SearchRecipient = ({
	title,
	description,
	profile,
	isOpen,
	network,
	onClose,
	onAction,
}: SearchRecipientProps) => {
	const { t } = useTranslation();

	const contacts = profile.contacts().values();
	const profileWallets = profile.wallets().values();

	const columns = [
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "address",
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "alias",
		},
		{
			Header: t("COMMON.TYPE"),
			accessor: "type",
		},
		{
			Header: <HeaderSearchBar placeholder={t("TRANSACTION.MODAL_SEARCH_RECIPIENT.SEARCH_PLACEHOLDER")} />,
			accessor: "search",
			className: "justify-end no-border",
			disableSortBy: true,
		},
	];

	const recipients = useMemo(() => {
		const recipientsList: Recipient[] = [];

		const isNetworkSelected = (addressNetwork: string) => {
			if (!network?.id()) {
				return true;
			}

			return addressNetwork === network?.id();
		};

		profileWallets.forEach((wallet) => {
			if (!isNetworkSelected(wallet.network().id())) {
				return;
			}

			recipientsList.push({
				id: wallet.id(),
				address: wallet.address(),
				alias: wallet.alias(),
				avatar: wallet.avatar(),
				type: "wallet",
				network: wallet.network().id(),
			});
		});

		contacts.forEach((contact) => {
			contact
				.addresses()
				.values()
				.forEach((contactAddress) => {
					if (!isNetworkSelected(contactAddress.network())) {
						return;
					}

					recipientsList.push({
						id: contactAddress.id(),
						address: contactAddress.address(),
						alias: contact.name(),
						avatar: contactAddress.avatar(),
						network: contactAddress.network(),
						type: "contact",
					});
				});
		});

		return recipientsList;
	}, [profileWallets, contacts, network]);

	return (
		<Modal
			isOpen={isOpen}
			title={title || t("TRANSACTION.MODAL_SEARCH_RECIPIENT.TITLE")}
			description={description || t("TRANSACTION.MODAL_SEARCH_RECIPIENT.DESCRIPTION")}
			size="5xl"
			onClose={onClose}
		>
			<div className="mt-8">
				<Table columns={columns} data={recipients}>
					{(recipient: Recipient) => <RecipientListItem recipient={recipient} onAction={onAction} />}
				</Table>
			</div>
		</Modal>
	);
};
