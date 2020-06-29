import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React from "react";

const columns = [
	{ Header: "Avatar", className: "invisible" },
	{
		Header: "Agent",
		className: "font-semibold text-md",
	},
	{
		Header: "Blockchain Name",
		className: "font-semibold text-md",
	},
	{
		Header: "History",
		className: "font-semibold text-md",
	},
	{
		Header: "Website",
		className: "font-semibold text-md",
	},
	{
		Header: "MSQ",
		className: "font-semibold text-md",
	},
	{
		Header: "Repository",
		className: "font-semibold text-md ml-4",
	},
	{
		Header: "Seed",
		className: "font-semibold text-md -ml-4",
	},
	{ Header: "Spacer", className: "invisible float-right" },
	{ Header: "Options", className: "invisible float-right" },
];

type Props = {
	data: any;
	handleDropdown: any;
};

const options = [
	{ label: "Update", value: "update" },
	{ label: "Transfer", value: "transfer" },
	{ label: "Resign", value: "resign" },
];

export const BlockchainTable = ({ data, handleDropdown }: Props) => (
	<div className="flex flex-col px-10 mt-4 bg-theme-background">
		<span className="py-10 text-2xl font-bold">Blockchain</span>
		<Table columns={columns} data={data}>
			{(rowData: any) => (
				<tr data-testid="blockchain-table__row" className="border-b border-dashed border-theme-neutral-light">
					<td className="w-24 py-4">
						<div className="flex items-center">
							<Circle className="border-theme-neutral-800" size="large">
								<Icon name="Business" width={22} height={22} />
							</Circle>
							<Avatar address="1Pdj" />
						</div>
					</td>
					<td className="py-4 mt-1 font-semibold">
						<span>{rowData.agent}</span>
					</td>
					<td className="py-1 font-semibold">
						<span>{rowData.blockchainName}</span>
					</td>
					<td className="py-1 text-semibold text-theme-primary">
						<span>View</span>
					</td>
					<td className="py-1 text-theme-neutral-400">
						<Icon name="Redirect" className="ml-4" />
					</td>
					<td className="py-1 text-semibold text-theme-primary">
						<Icon name="Msq" width={22} height={22} className="ml-1" />
					</td>
					<td className="py-1 text-semibold text-theme-primary">
						<span className="ml-7">View</span>
					</td>
					<td className="py-1 text-semibold text-theme-primary">
						<span className="-ml-5">View</span>
					</td>
					<td className="px-1 px-11" />
					<td className="float-right py-1">
						<Button variant="plain" className="mt-4" size="small">
							<Dropdown
								toggleIcon="Settings"
								options={options}
								onSelect={(option: any) => handleDropdown(option)}
							/>
						</Button>
					</td>
				</tr>
			)}
		</Table>
	</div>
);
