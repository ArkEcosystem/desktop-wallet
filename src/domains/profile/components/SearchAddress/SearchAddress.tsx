import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchContactProps = {
	title?: string;
	description?: string;
	isOpen: boolean;
	wallets: any[];
	onClose?: any;
	onSearch?: any;
	selectActionLabel?: string;
	onAction?: (actionName: string, address: any) => void;
};

const SearchAddressListItem = ({ walletName, address, fiat, balance, onAction, index, selectActionLabel }: any) => (
	<tr className="border-b border-theme-neutral-200">
		<td className="py-6 mt-1">
			<Avatar size="lg" address={address} />
		</td>
		<td className="py-1">
			<Address walletName={walletName} address={address} maxChars={22} />
		</td>
		<td className="font-semibold">
			<div>{balance}</div>
		</td>
		<td className="text-theme-neutral-light">
			<div>{fiat}</div>
		</td>
		<td className="border-b border-dashed border-theme-neutral-200">
			<Button
				data-testid={`AddressListItem__select-${index}`}
				className="float-right"
				variant="plain"
				onClick={() => onAction?.("select" as any, address)}
			>
				{selectActionLabel}
			</Button>
		</td>
	</tr>
);
export const SearchAddress = ({
	isOpen,
	wallets,
	onClose,
	onSearch,
	onAction,
	title,
	description,
	selectActionLabel,
}: SearchContactProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: "Avatar",
			className: "invisible",
		},
		{
			Header: "Name/Address",
		},
		{
			Header: "Balance",
		},
		{
			Header: "Fiat Value",
		},
		{
			Header: "Action",
			className: "invisible",
		},
	];
	return (
		<SearchResource
			isOpen={isOpen}
			title={title || t("PROFILE.MODAL_SEARCH_ADDRESS.TITLE")}
			description={description || t("PROFILE.MODAL_SEARCH_ADDRESS.DESCRIPTION")}
			placeholder="Search..."
			onClose={onClose}
			onSearch={onSearch}
		>
			<Table columns={columns} data={wallets}>
				{({ address, walletName, balance, fiat }: any, index: number) => (
					<SearchAddressListItem
						address={address}
						walletName={walletName}
						balance={balance}
						fiat={fiat}
						index={index}
						selectActionLabel={selectActionLabel}
						onAction={onAction}
					/>
				)}
			</Table>
		</SearchResource>
	);
};

SearchAddress.defaultProps = {
	wallets: [],
	selectActionLabel: "Select",
};
