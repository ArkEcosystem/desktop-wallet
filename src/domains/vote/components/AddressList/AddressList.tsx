import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { AddressListItem } from "../AddressListItem";

type AddressListProps = {
	data?: any;
	onSelect?: (address: string) => void;
};

export const AddressList = (props: AddressListProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			accessor: "walletAddressAvatar",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "walletAddress",
		},
		{
			accessor: "type",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
		},
		{
			accessor: "delegateAddressAvatar",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.DELEGATE"),
			accessor: "delegate",
		},
		{
			Header: t("COMMON.RANK"),
			accessor: "rank",
		},
		{
			Header: t("COMMON.PROFILE"),
			accessor: "profile",
			disableSortBy: true,
			className: "justify-center",
		},
		{
			Header: t("COMMON.STATUS"),
			accessor: "status",
			disableSortBy: true,
			className: "justify-center",
		},
		{
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

	return (
		<div data-testid="AddressList">
			<h2 className="py-5 text-2xl font-bold">Select Address</h2>
			<Table columns={columns} data={props.data}>
				{(rowData: any) => <AddressListItem {...rowData} onSelect={props.onSelect} />}
			</Table>
		</div>
	);
};

AddressList.defaultProps = {
	data: [],
};
