import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { DelegateRowItem } from "./DelegateRowItem";

type Props = {
	wallets: ReadWriteWallet[];
	onAction?: any;
};

type DelegateRowItem = {
	wallet: ReadWriteWallet;
	onAction?: any;
};

export const DelegateTable = ({ wallets, onAction }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: "Avatar",
			className: "hidden",
		},
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
				{(wallet: ReadWriteWallet) => <DelegateRowItem wallet={wallet} onAction={onAction} />}
			</Table>
		</Section>
	);
};
