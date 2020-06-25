import { Table } from "app/components/Table";
import React from "react";

const columns = [
	{
		Header: "Agent",
		accessor: "agent",
	},
	{
		Header: "Business Name",
		accessor: "businessName",
	},
	{
		Header: "History",
		accessor: "history",
	},
	{
		Header: "Website",
		accessor: "website",
	},
	{
		Header: "MSQ",
		accessor: "msq",
	},
	{
		Header: "Repository",
		accessor: "repository",
	},
];

type Props = {
	data: any;
};

export const BusinessTable = ({ data }: Props) => {
	console.log({ data });
	return (
		<div className="flex flex-col bg-theme-background mt-4">
			<span className="font-bold text-xl">Business</span>
			<Table columns={columns} data={data}>
				{(rowData: any) => (
					<tr className="border-b border-theme-neutral-200">
						<td className="py-4 mt-1">
							<span>{rowData.agent}</span>
						</td>
						<td className="py-1">
							<span>{rowData.businessName}</span>
						</td>
						<td className="py-1 text-bold">
							<span>history</span>
						</td>
						<td className="py-1 text-bold text-theme-neutral-400">
							<span>msq</span>
						</td>
						<td className="py-1 text-bold text-theme-neutral-400">
							<span>repo</span>
						</td>
						<td className="py-1 text-bold text-theme-neutral-400">
							<span>website</span>
						</td>
					</tr>
				)}
			</Table>
		</div>
	);
};
