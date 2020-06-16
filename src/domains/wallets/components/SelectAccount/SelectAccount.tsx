import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Dropdown } from "app/components/Dropdown";
import { Modal } from "app/components/Modal";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import React from "react";

type Props = {
	isOpen: boolean;
	wallets?: any;
	handleClose?: any;
	handleSelect?: any;
};

export const SelectAccount = ({ isOpen, wallets, handleClose }: Props) => {
	const listColumns = [
		{
			Header: "Asset Type",
			accessor: "avatarId",
		},
		{
			Header: "Wallet Address",
			accessor: "address",
		},
		{
			Header: "Balance",
			accessor: "balance",
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			accessor: "fiat",
			className: "float-right",
		},
	];

	return (
		<Modal
			isOpen={isOpen}
			title={"Select Account"}
			description={"Find and select the account you want to receive funds to"}
			onClose={() => handleClose()}
		>
			<div className="bg-theme-neutral-100 mt-8 -mx-16 px-16 py-8">
				<div className="flex items-center bg-white rounded shadow px-10 py-6">
					<div className="relative inline-block text-theme-primary-400 mr-6">
						<Dropdown toggleIcon="Filters">Filters?</Dropdown>
					</div>

					<Divider type="vertical"></Divider>

					<div className="flex-1"></div>

					<Divider type="vertical"></Divider>

					<Button className="ml-6">Find it</Button>
				</div>
			</div>

			<div className="mt-8">
				<Table columns={listColumns} data={wallets}>
					{(rowData: any) => <WalletListItem {...rowData}></WalletListItem>}
				</Table>
			</div>
		</Modal>
	);
};

SelectAccount.defaultProps = {
	wallets: [],
};
