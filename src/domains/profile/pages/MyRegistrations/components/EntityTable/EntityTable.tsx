import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Section } from "app/components/Layout";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { EntityTableRowItem } from "./EntityTableRowItem";

type Props = {
	onAction?: any;
	entities: ExtendedTransactionData[];
};

export const EntityTable = ({ entities, onAction }: Props) => {
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

			<Table columns={columns} data={entities}>
				{(entity: any) => <EntityTableRowItem entity={entity} onAction={onAction} />}
			</Table>
		</Section>
	);
};
