import { Table } from "app/components/Table";
import React from "react";

import { AddressListItem } from "../AddressListItem";

type AddressListProps = {
	data?: any;
};

export const AddressList = (props: AddressListProps) => {
	const columns = [
		{
			Header: "",
			accessor: "walletAddressAvatar",
			disableSortBy: true,
		},
		{
			Header: "My Address",
			accessor: "walletAddress",
		},
		{
			Header: "",
			accessor: "type",
			disableSortBy: true,
			className: "flex justify-center",
		},
		{
			Header: "Balance",
			accessor: "balance",
		},
		{
			Header: "",
			accessor: "delegateAddressAvatar",
			disableSortBy: true,
		},
		{
			Header: "Delegate",
			accessor: "delegate",
		},
		{
			Header: "Rank",
			accessor: "rank",
		},
		{
			Header: "Profile",
			accessor: "profile",
			disableSortBy: true,
			className: "flex justify-center",
		},
		{
			Header: "Status",
			accessor: "status",
			disableSortBy: true,
			className: "flex justify-center",
		},
		{
			Header: "",
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

	return (
		<Table columns={columns} data={props.data}>
			{(rowData: any) => <AddressListItem {...rowData} />}
		</Table>
	);
};

AddressList.defaultProps = {
	data: [],
};
