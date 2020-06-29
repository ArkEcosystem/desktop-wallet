import { Table } from "app/components/Table";
import React from "react";

import { DelegateListItem } from "../DelegateListItem";

type DelegateListProps = {
	data?: any;
};

export const DelegateList = (props: DelegateListProps) => {
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

	return (
		<Table columns={columns} data={props.data}>
			{(rowData: any) => <DelegateListItem {...rowData} />}
		</Table>
	);
};

DelegateList.defaultProps = {
	data: [],
};
