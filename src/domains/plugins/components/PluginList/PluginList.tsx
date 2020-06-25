import { Table } from "app/components/Table";
import { PluginListItem } from "domains/plugins/components/PluginListItem";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListProps = {
	onDelete: any;
	onInstall: any;
	plugins: any[];
	className?: string;
};

export const PluginList = ({ className, onDelete, onInstall, plugins }: PluginListProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: " ",
			disableSortBy: true,
			className: "w-18",
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.AUTHOR"),
			accessor: "author",
		},
		{
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
		},
		{
			Header: t("COMMON.RATING"),
			accessor: "rating",
		},
		{
			Header: t("COMMON.VERSION"),
			accessor: "version",
		},
		{
			Header: t("COMMON.SIZE"),
			accessor: "size",
		},
		{
			Header: t("COMMON.STATUS"),
			accessor: "isInstalled",
			disableSortBy: true,
			className: "justify-center",
		},
		{
			Header: "  ",
			disableSortBy: true,
		},
	];

	return (
		<div data-testid="PluginList" className={className}>
			<Table columns={columns} data={plugins}>
				{(plugin: any) => <PluginListItem plugin={plugin} onInstall={onInstall} onDelete={onDelete} />}
			</Table>
		</div>
	);
};
