import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React from "react";

const columns = [
	{ Header: "Avatar", className: "invisible" },
	{
		Header: "Delegate Name",
		className: "font-semibold text-md ml-5",
	},
	{
		Header: "Rank",
		className: "font-semibold text-md -ml-20",
	},
	{
		Header: "MSQ",
		className: "font-semibold text-md",
	},
	{
		Header: "Status",
		className: "font-semibold text-md",
	},
	{
		Header: "Amount",
		className: "invisible w-3 float-right",
	},
	{
		Header: "Votes",
		className: "font-semibold text-md float-right",
	},
	{ Header: "Options", className: "invisible float-right" },
];

type Props = {
	data: any;
};

const options = [
	{ label: "Update", value: "update" },
	{ label: "Transfer", value: "transfer" },
	{ label: "Resign", value: "resign" },
];

export const DelegateTable = ({ data }: Props) => (
	<div className="flex flex-col bg-theme-background mt-4">
		<span className="p-10 font-bold text-2xl">Delegate</span>
		<Table columns={columns} data={data}>
			{(rowData: any) => (
				<tr data-testid="business-table__row" className="border-b border-dashed border-theme-neutral-light">
					<td className="py-4">
						<div className="ml-10 -mr-16">
							<Circle className="border-theme-neutral-800" size="large">
								<Icon name="Business" width={22} height={22} />
							</Circle>
							<Circle avatarId="test" size="large" className="-ml-1" />
						</div>
					</td>
					<td className="py-4 mt-1 font-semibold pl-5">
						<span>{rowData.delegate}</span>
					</td>
					<td className="py-1 text-theme-neutral-700">
						<span className="-ml-20">{rowData.rank}</span>
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<Icon name="Msq" width={25} height={25} />
					</td>
					<td className="py-1 text-theme-neutral-400">
						<Icon name="Redirect" className="ml-3" />
					</td>
					<td className="px-20 text-bold text-theme-neutral-700">
						<div className="flex items-center float-right -mr-20">
							<span>2,450.643</span>
							<Icon name="Ark" className="ml-2" />
						</div>
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<span className="float-right">View</span>
					</td>
					<td className="py-1 float-right">
						<Button variant="plain" className="mt-4" size="small">
							<Dropdown
								toggleIcon="Settings"
								options={options}
								onSelect={(option: any) => console.log(option)}
							/>
						</Button>
					</td>
				</tr>
			)}
		</Table>
	</div>
);
