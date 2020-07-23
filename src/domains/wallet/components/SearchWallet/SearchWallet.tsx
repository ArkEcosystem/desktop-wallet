import { SearchBarFilters } from "app/components/SearchBar/SearchBarFilters";
import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchWalletProps = {
	isOpen: boolean;
	wallets?: any;
	networks?: any;
	onNetworkChange?: any;
	onViewAllNetworks?: any;
	onClose?: any;
	onSearch?: any;
};

export const SearchWallet = ({
	isOpen,
	wallets,
	networks,
	onNetworkChange,
	onViewAllNetworks,
	onClose,
	onSearch,
}: SearchWalletProps) => {
	const { t } = useTranslation();

	const listColumns = [
		{
			Header: t("COMMON.ASSET_TYPE"),
			accessor: "avatarId",
		},
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "address",
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: "fiat",
			className: "justify-end",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={t("WALLETS.MODAL_SELECT_ACCOUNT.TITLE")}
			description={t("WALLETS.MODAL_SELECT_ACCOUNT.DESCRIPTION")}
			searchBarExtra={
				<SearchBarFilters
					networks={networks}
					onNetworkChange={onNetworkChange}
					onViewAllNetworks={onViewAllNetworks}
				/>
			}
			onClose={onClose}
			onSearch={onSearch}
		>
			<Table columns={listColumns} data={wallets}>
				{(rowData: any) => <WalletListItem variant="singleAction" {...rowData} />}
			</Table>
		</SearchResource>
	);
};

SearchWallet.defaultProps = {
	isOpen: false,
	wallets: [],
	networks: [],
};
