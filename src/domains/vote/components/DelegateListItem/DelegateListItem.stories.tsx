import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Table } from "app/components/Table";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { DelegateListItem } from "./DelegateListItem";

export default {
	title: "Domains / Vote / Components / DelegateListItem",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

const columns = [
	{
		Header: "",
		accessor: "delegateAddressAvatar",
		disableSortBy: true,
	},
	{
		Header: "Delegate Name",
		accessor: "delegateName",
	},
	{
		Header: "Rank",
		accessor: "rank",
	},
	{
		Header: "Votes",
		accessor: "votes",
	},
	{
		Header: "Profile",
		accessor: "profile",
		disableSortBy: true,
		className: "flex justify-center",
	},
	{
		Header: "Comm.",
		accessor: "commissionPercentage",
	},
	{
		Header: "Payout",
		accessor: "payout",
	},
	{
		Header: "Min",
		accessor: "min",
	},
	{
		Header: "Commission (Daily)",
		accessor: "commissionDaily",
	},
	{
		Header: "",
		accessor: "onSelect",
		disableSortBy: true,
	},
];

export const Default = ({ delegates }: { delegates: Coins.WalletDataCollection }) => (
	<Table columns={columns} data={[delegates.items()[0]]}>
		{(delegate: Contracts.WalletData, index: number) => <DelegateListItem index={index} delegate={delegate} />}
	</Table>
);
