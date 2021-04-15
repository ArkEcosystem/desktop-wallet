import { chunk } from "@arkecosystem/utils";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import { PluginListItem } from "domains/plugin/components/PluginListItem";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListProps = {
	className?: string;
	emptyMessage?: string;
	itemsPerPage?: number;
	plugins: any[];
	showCategory?: boolean;
	showPagination?: boolean;
	updatingStats?: any;
	onClick?: (plugin: any) => void;
	onDelete: any;
	onDisable?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onInstall: any;
	onLaunch?: (plugin: any) => void;
	onUpdate?: (plugin: any) => void;
};

export const PluginList = ({
	className,
	emptyMessage,
	itemsPerPage,
	plugins,
	showCategory,
	showPagination,
	updatingStats,
	onClick,
	onDelete,
	onDisable,
	onEnable,
	onInstall,
	onLaunch,
	onUpdate,
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
			className: "justify-center no-border",
		},
		{
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	if (showCategory) {
		columns.splice(2, 0, {
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
		});
	}

	if (!plugins.length) {
		return (
			<EmptyBlock data-testid="PluginList__empty-message">
				{emptyMessage || t("PLUGINS.PAGE_PLUGIN_MANAGER.NO_PLUGINS_AVAILABLE")}
			</EmptyBlock>
		);
	}

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
						showCategory={showCategory}
					/>
				)}
			</Table>

			{showPagination && (
				<div className="flex justify-center w-full mt-10">
					<Pagination
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						totalCount={plugins.length}
						onSelectPage={setCurrentPage}
					/>
				</div>
			)}
		</div>
	);
};

PluginList.defaultProps = {
	itemsPerPage: 10,
	showPagination: true,
};
