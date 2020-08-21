import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	data: any;
	onAction: any;
};

const options = [
	{ label: "Update", value: "update" },
	{ label: "Transfer", value: "transfer" },
	{ label: "Resign", value: "resign" },
];

const getStatusIcon = (confirmed: boolean) => {
	if (!confirmed) {
		return <Icon name="StatusClock" className="ml-2 text-theme-neutral" />;
	}

	return <Icon name="Checkmark" className="ml-1 text-theme-success" width={30} height={30} />;
};

export const DelegateTable = ({ data, onAction }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{ Header: "Avatar", className: "invisible" },
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.DELEGATE_NAME"),
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.RANK"),
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.MSQ"),
			className: "justify-center",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.STATUS"),
			className: "justify-center",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.FORGED_AMOUNT"),
			className: "justify-end",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.VOTES"),
			className: "justify-end",
		},
	];

	return (
		<Section>
			<h2 className="mb-8 font-bold">{t("PROFILE.PAGE_MY_REGISTRATIONS.DELEGATE")}</h2>

			<Table columns={columns} data={data}>
				{(rowData: any) => (
					<tr data-testid="delegate-table__row" className="border-b border-dashed border-theme-neutral-light">
						<td className="w-24 py-6">
							<div className="flex items-center">
								<Circle className="border-theme-neutral-800" size="lg">
									<Icon name="Business" width={22} height={22} />
								</Circle>
								<Avatar address="APTz" size="lg" className="mr-4" />
							</div>
						</td>
						<td className="font-semibold">
							<span>{rowData.delegate}</span>
						</td>
						<td className="font-semibold text-theme-neutral-dark">
							<span>{rowData.rank}</span>
						</td>
						<td className="font-semibold text-center text-theme-primary">
							<span className="flex justify-center">
								<Icon name="Msq" width={22} height={22} />
							</span>
						</td>
						<td className="text-theme-neutral-light">
							<span className="flex justify-center">{getStatusIcon(rowData.confirmed)}</span>
						</td>
						<td className="font-semibold text-theme-neutral-dark">
							<div className="flex items-center justify-end">
								<span className="whitespace-no-wrap">2,450.643 Ѧ</span>
							</div>
						</td>
						<td className="font-semibold text-theme-neutral-dark">
							<div className="flex items-center justify-end">
								<small className="text-theme-neutral">2,43%</small>
								<span className="ml-1 whitespace-no-wrap">2,450.643 Ѧ</span>
							</div>
						</td>
						<td className="align-middle">
							<span className="flex justify-end">
								<Button variant="plain" size="sm" className="ml-16">
									<Dropdown
										toggleIcon="Settings"
										options={options}
										onSelect={({ value }: any) =>
											onAction?.({ walletId: rowData.id(), action: value })
										}
									/>
								</Button>
							</span>
						</td>
					</tr>
				)}
			</Table>
		</Section>
	);
};
