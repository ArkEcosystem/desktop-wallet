import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { EntityTableRowItem } from "./EntityTableRowItem";

type Props = {
	title: string;
	nameColumnHeader: string;
	onAction?: any;
	type?: string;
	entities: ExtendedTransactionData[];
};

export const EntityTable = ({ entities, onAction, title, type, nameColumnHeader }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: "Avatar",
			className: "hidden",
		},
		{
			Header: t("PROFILE.PAGE_MY_REGISTRATIONS.ADDRESS"),
		},
		{
			Header: nameColumnHeader,
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
			Header: "Actions",
			className: "hidden",
		},
	];

	return (
		<>
			<h2 className="mb-8 font-bold">{title}</h2>

			<Table columns={columns} data={entities}>
				{(entity: any) => <EntityTableRowItem entity={entity} type={type} onAction={onAction} />}
			</Table>
		</>
	);
};
