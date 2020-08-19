// import { Table } from "app/components/Table";
// import React from "react";

// import { DelegateListItem } from "./DelegateListItem";

// export default { title: "Domains / Vote / Components / DelegateListItem" };

// const data = [
// 	{
// 		delegateAddress: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
// 		delegateName: "Delegate 1",
// 		rank: 1,
// 		votes: 3.43,
// 		msqUrl: "https://marketsquare.ark.io",
// 		commissionPercentage: 80,
// 		commissionDaily: 2.387082496,
// 		payout: "Daily",
// 		min: 500,
// 	},
// ];

// const columns = [
// 	{
// 		Header: "",
// 		accessor: "delegateAddressAvatar",
// 		disableSortBy: true,
// 	},
// 	{
// 		Header: "Delegate Name",
// 		accessor: "delegateName",
// 	},
// 	{
// 		Header: "Rank",
// 		accessor: "rank",
// 	},
// 	{
// 		Header: "Votes",
// 		accessor: "votes",
// 	},
// 	{
// 		Header: "Profile",
// 		accessor: "profile",
// 		disableSortBy: true,
// 		className: "flex justify-center",
// 	},
// 	{
// 		Header: "Comm.",
// 		accessor: "commissionPercentage",
// 	},
// 	{
// 		Header: "Payout",
// 		accessor: "payout",
// 	},
// 	{
// 		Header: "Min",
// 		accessor: "min",
// 	},
// 	{
// 		Header: "Commission (Daily)",
// 		accessor: "commissionDaily",
// 	},
// 	{
// 		Header: "",
// 		accessor: "onSelect",
// 		disableSortBy: true,
// 	},
// ];

// export const Default = () => (
// 	<Table columns={columns} data={data}>
// 		{(rowData: any) => <DelegateListItem {...rowData} />}
// 	</Table>
// );
