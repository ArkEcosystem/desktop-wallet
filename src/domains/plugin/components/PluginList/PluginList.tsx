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
	onClick?: (plugin: any) => void;
	onLaunch?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onDisable?: (plugin: any) => void;
	onUpdate?: (plugin: any) => void;
	onInstall: any;
	plugins: any[];
	updatingStats?: any;
	withPagination?: boolean;
};

export const PluginList = ({
	className,
	itemsPerPage,
	onClick,
	onEnable,
	onDisable,
	onDelete,
	onLaunch,
	onInstall,
	onUpdate,
	plugins,
	updatingStats,
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
						onClick={onClick}
						onLaunch={onLaunch}
						onInstall={onInstall}
						onDelete={onDelete}
						onEnable={onEnable}
						onDisable={onDisable}
						onUpdate={onUpdate}
						isUpdating={updatingStats?.[plugin.name]?.percent !== undefined}
						updatingProgress={updatingStats?.[plugin.name]?.percent}
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
