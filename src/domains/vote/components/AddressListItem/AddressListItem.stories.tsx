import { Table } from "app/components/Table";
import React from "react";

import { AddressListItem } from "./AddressListItem";

export default { title: "Domains / Vote / Components / AddressListItem" };

const data = [
	{
		walletAddress: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		walletName: "OLEBank",
		type: "Multisig",
		balance: "1,000,000 ARK",
		delegateAddress: "DACFobAjNEKsc1CtPSMyp5uA4wp6uC3fgC",
		delegateName: "Delegate 1",
		rank: 2,
		msqUrl: "https://marketsquare.ark.io",
		isActive: true,
	},
];

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

export const Default = () => (
	<Table columns={columns} data={data}>
		{(rowData: any) => <AddressListItem {...rowData} />}
	</Table>
);
