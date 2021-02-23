import { chunk } from "@arkecosystem/utils";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import { PluginListItem } from "domains/plugin/components/PluginListItem";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListProps = {
	className?: string;
	itemsPerPage?: number;
	onDelete: any;
	onLaunch?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onDisable?: (plugin: any) => void;
	onInstall: any;
	plugins: any[];
	withPagination?: boolean;
};

export const PluginList = ({
	className,
	itemsPerPage,
	onEnable,
	onDisable,
	onDelete,
	onLaunch,
	onInstall,
	plugins,
	withPagination,
}: PluginListProps) => {
	const { t } = useTranslation();

	const [currentPage, setCurrentPage] = React.useState(1);

	const initialState = {
		sortBy: [
			{
				id: "title",
			},
		],
	};

	const columns = [
		{
			Header: t("COMMON.NAME"),
			accessor: "title",
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
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	const pagePlugins = chunk(plugins, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginList" className={className}>
			<Table columns={columns} data={pagePlugins} initialState={initialState}>
				{(plugin: any) => (
					<PluginListItem
						plugin={plugin}
						onLaunch={onLaunch}
						onInstall={onInstall}
						onDelete={onDelete}
						onEnable={onEnable}
						onDisable={onDisable}
					/>
				)}
			</Table>

			{withPagination && (
				<div className="flex justify-center">
					<Pagination
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						totalCount={plugins.length}
						onSelectPage={setCurrentPage}
						className="mt-5"
					/>
				</div>
			)}
		</div>
	);
};

PluginList.defaultProps = {
	itemsPerPage: 10,
	withPagination: true,
};
