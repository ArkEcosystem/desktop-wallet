import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { AddressListItem } from "./AddressListItem";

export default {
	title: "Domains / Vote / Components / AddressListItem",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

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

export const Default = ({ wallets }: { wallets: Wallet[] }) => (
	<Table columns={columns} data={[wallets[0]]}>
		{(wallet: Wallet, index: number) => <AddressListItem index={index} wallet={wallet} />}
	</Table>
);
