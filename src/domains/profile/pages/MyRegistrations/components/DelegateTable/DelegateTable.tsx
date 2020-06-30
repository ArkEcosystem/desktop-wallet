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
		Header: "Delegate Name",
		className: "font-semibold text-md",
	},
	{
		Header: "Rank",
		className: "font-semibold text-md -ml-14",
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
		className: "font-semibold text-md float-right ml-32",
	},
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

const getStatusIcon = (confirmed: boolean) => {
	if (!confirmed) {
		return <Icon name="StatusClock" className="ml-2 text-theme-neutral-500" />;
	}

	return <Icon name="Checkmark" className="ml-1 text-theme-success" width={30} height={30} />;
};

export const DelegateTable = ({ data, handleDropdown }: Props) => (
	<div className="flex flex-col px-10 mt-4 bg-theme-background">
		<span className="py-10 text-2xl font-bold">Delegate</span>
		<Table columns={columns} data={data}>
			{(rowData: any) => (
				<tr data-testid="delegate-table__row" className="border-b border-dashed border-theme-neutral-light">
					<td className="w-24 py-6">
						<div className="flex items-center">
							<Circle className="border-theme-neutral-800" size="large">
								<Icon name="Business" width={22} height={22} />
							</Circle>
							<Avatar address="APTz" />
						</div>
					</td>
					<td className="py-6 mt-1 font-semibold">
						<span>{rowData.delegate}</span>
					</td>
					<td className="py-6  text-theme-neutral-700">
						<span className="-ml-14">{rowData.rank}</span>
					</td>
					<td className="py-6  text-bold text-theme-primary">
						<Icon name="Msq" width={22} height={22} />
					</td>
					<td className="py-6  text-theme-neutral-400">{getStatusIcon(rowData.confirmed)}</td>
					<td>
						<div className="flex float-right text-semibold text-theme-neutral-800">
							<div className="flex items-center">
								<span className="ml-16">2,450.643</span>
								<Icon name="Ark" className="ml-2" />
							</div>
						</div>
					</td>
					<td className="w-1/12 text-semibold text-theme-neutral-800">
						<div className="flex items-center ml-5 -mr-10">
							<small className="text-theme-neutral-500">2,43%</small>
							<span className="ml-1">2,450.643</span>
							<Icon name="Ark" className="ml-2" />
						</div>
					</td>
					<td className="float-right py-6 mt-1 flex justify-center items-center">
						<Button variant="plain" size="small">
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
