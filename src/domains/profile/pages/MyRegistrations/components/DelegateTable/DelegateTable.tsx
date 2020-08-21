import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { DelegateRowItem } from "./DelegateRowItem";

type Props = {
	wallets: Wallet[];
	onAction?: any;
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

type DelegateRowItem = {
	wallet: Wallet;
	onAction?: any;
};

export const DelegateTable = ({ wallets, onAction }: Props) => {
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

			<Table columns={columns} data={wallets}>
				{(wallet: Wallet) => <DelegateRowItem wallet={wallet} onAction={onAction} />}
			</Table>
		</Section>
	);
};
