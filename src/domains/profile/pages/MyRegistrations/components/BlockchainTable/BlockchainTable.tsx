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
	onAction?: any;
};

const options = [
	{ label: "Update", value: "update" },
	{ label: "Transfer", value: "transfer" },
	{ label: "Resign", value: "resign" },
];

export const BlockchainTable = ({ data, onAction }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{ Header: "Avatar", className: "invisible" },
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.AGENT"),
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.BLOCKCHAIN_NAME"),
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.HISTORY"),
			className: "justify-center",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.WEBSITE"),
			className: "justify-center",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.MSQ"),
			className: "justify-center",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.REPOSITORY"),
			className: "justify-center",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.SEED"),
			className: "justify-center",
		},
		{ Header: "Options", className: "invisible" },
	];

	return (
		<Section>
			<h2 className="mb-8 font-bold">{t("PROFILE.PAGE_MY_REGISTRATIONS.BLOCKCHAIN")}</h2>

			<Table columns={columns} data={data}>
				{(rowData: any) => (
					<tr
						data-testid="BlockchainRegistrationItem"
						className="border-b border-dashed border-theme-neutral-light"
					>
						<td className="w-24 py-6">
							<div className="flex items-center">
								<Circle className="border-theme-neutral-800" size="lg">
									<Icon name="Business" width={22} height={22} />
								</Circle>
								<Avatar address="1Pdj" size="lg" className="mr-4" />
							</div>
						</td>
						<td className="font-semibold">
							<span>{rowData.agent}</span>
						</td>
						<td className="font-semibold">
							<span>{rowData.blockchainName}</span>
						</td>
						<td className="font-semibold text-center text-theme-primary">
							<span>{t("COMMON.VIEW")}</span>
						</td>
						<td className="text-center text-theme-neutral-light">
							<span className="flex justify-center">
								<Icon name="Redirect" className="text-center" />
							</span>
						</td>
						<td className="font-semibold text-center text-theme-primary">
							<span className="flex justify-center">
								<Icon name="Msq" width={22} height={22} />
							</span>
						</td>
						<td className="font-semibold text-center text-theme-primary">
							<span>{t("COMMON.VIEW")}</span>
						</td>
						<td className="font-semibold text-center text-theme-primary">
							<span>{t("COMMON.VIEW")}</span>
						</td>
						<td className="align-middle">
							<span className="flex justify-end">
								<Button variant="plain" size="sm" className="ml-16">
									<Dropdown
										toggleIcon="Settings"
										options={options}
										onSelect={(option: any) => onAction?.(option)}
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
