import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { BusinessRowItem } from "./BusinessRowItem";

type Props = {
	onAction?: any;
	businesses: ExtendedTransactionData[];
};

export const BusinessTable = ({ businesses, onAction }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{ Header: "Avatar", className: "invisible" },
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.AGENT"),
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS_NAME"),
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
		{ Header: "Options", className: "invisible" },
	];

	return (
		<Section>
			<h2 className="mb-8 font-bold">{t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS")}</h2>

			<Table columns={columns} data={businesses}>
				{(business: any) => <BusinessRowItem business={business} onAction={onAction} />}
			</Table>
		</Section>
	);
};
