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
		className: "font-semibold text-md",
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

export const BusinessTable = ({ data }: Props) => (
	<div className="flex flex-col bg-theme-background mt-4">
		<span className="p-10 font-bold text-xl">Business</span>
		<Table columns={columns} data={data}>
			{(rowData: any) => (
				<tr data-testid="business-table__row" className="border-b border-dashed border-theme-neutral-light">
					<td className="py-3">
						<div className="ml-10 -mr-16">
							<Circle className="border-theme-neutral-800" size="large">
								<Icon name="Business" width={22} height={22} />
							</Circle>
							<Circle avatarId="test" size="large" className="-ml-1" />
						</div>
					</td>
					<td className="py-4 mt-1 font-semibold">
						<span>{rowData.agent}</span>
					</td>
					<td className="py-1 font-semibold">
						<span>{rowData.businessName}</span>
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<span>View</span>
					</td>
					<td className="py-1 text-theme-neutral-400">
						<Icon name="Redirect" className="ml-4" />
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<Icon name="Msq" width={25} height={25} />
					</td>
					<td className="py-1 text-bold text-theme-primary">
						<span className="ml-3">View</span>
					</td>
					<td className="py-1 float-right">
						<Button variant="plain" className="mt-3" size="small">
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
