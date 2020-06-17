import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Dropdown } from "app/components/Dropdown";
import { Modal } from "app/components/Modal";
// import { SearchBarFilters } from "domains/search/components/SearchBarFilters";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import { SearchBar } from "domains/search/components/SearchBar";
import { SearchBarFilters } from "domains/search/components/SearchBarFilters";
import React from "react";
import { useTranslation } from "react-i18next";

type SelectAccountProps = {
	isOpen: boolean;
	wallets?: any;
	networks?: any;
	onNetworkChange?: any;
	onViewAllNetworks?: any;
	handleClose?: any;
	handleSelect?: any;
};

export const SelectAccount = ({
	isOpen,
	wallets,
	networks,
	onNetworkChange,
	onViewAllNetworks,
	handleClose,
}: SelectAccountProps) => {
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
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "float-right",
		},
		{
			Header: t("Fiat Value"),
			accessor: "fiat",
			className: "float-right",
		},
	];

	return (
		<Modal
			size={"4xl"}
			isOpen={isOpen}
			title={t("WALLETS.MODAL_SELECT_ACCOUNT.TITLE")}
			description={t("WALLETS.MODAL_SELECT_ACCOUNT.DESCRIPTION")}
			onClose={() => handleClose()}
		>
			<div className="-mx-16">
				<SearchBar className="mt-8">
					<SearchBarFilters
						networks={networks}
						onNetworkChange={onNetworkChange}
						onViewAllNetworks={onViewAllNetworks}
					/>
				</SearchBar>
			</div>

			<div className="mt-8">
				<Table columns={listColumns} data={wallets}>
					{(rowData: any) => <WalletListItem variant="singleAction" {...rowData} />}
				</Table>
			</div>
		</Modal>
	);
};

SelectAccount.defaultProps = {
	isOpen: false,
	wallets: [],
	networks: [],
};
