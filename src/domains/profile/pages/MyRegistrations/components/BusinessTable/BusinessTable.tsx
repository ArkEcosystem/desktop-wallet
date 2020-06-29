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
		Header: "Business Name",
		className: "font-semibold text-md",
	},
	{
		Header: "History",
		className: "font-semibold text-md -ml-8",
	},
	{
		Header: "Website",
		className: "font-semibold text-md ml-8 -mr-6",
	},
	{
		Header: "MSQ",
		className: "font-semibold text-md",
	},
	{
		Header: "Repository",
		className: "font-semibold text-md ml-2",
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

export const BusinessTable = ({ data, handleDropdown }: Props) => (
	<div className="flex flex-col bg-theme-background mt-4 px-10">
		<span className="py-10 font-bold text-2xl">Business</span>
		<Table columns={columns} data={data}>
			{(rowData: any) => (
				<tr data-testid="business-table__row" className="border-b border-dashed border-theme-neutral-light">
					<td className="py-4 w-24">
						<div className="flex items-center">
							<Circle className="border-theme-neutral-800" size="large">
								<Icon name="Business" width={22} height={22} />
							</Circle>
							<Avatar address="AaAy" />
						</div>
					</td>
					<td className="py-4 mt-1 font-semibold">
						<span>{rowData.agent}</span>
					</td>
					<td className="py-1 font-semibold">
						<span>{rowData.businessName}</span>
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<span className="-ml-8">View</span>
					</td>
					<td className="py-1 text-theme-neutral-400">
						<Icon name="Redirect" className="ml-12" />
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<Icon name="Msq" width={22} height={22} className="ml-1" />
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<span className="ml-3">View</span>
					</td>
					<td className="px-1 px-12" />
					<td className="py-1 float-right">
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
