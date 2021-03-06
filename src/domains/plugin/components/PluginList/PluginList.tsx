import { chunk } from "@arkecosystem/utils";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import { PluginListItem } from "domains/plugin/components/PluginListItem";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

interface PluginListProperties {
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
}

export const PluginList = ({
	className,
	emptyMessage,
	itemsPerPage = 10,
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
}: PluginListProperties) => {
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
			className: "justify-center no-border",
			disableSortBy: true,
		},
		{
			Header: "Actions",
			className: "hidden",
			disableSortBy: true,
		},
	];

	if (showCategory) {
		columns.splice(2, 0, {
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
		});
	}

	if (plugins.length === 0) {
		return (
			<EmptyBlock data-testid="PluginList__empty-message">
				<Trans>{emptyMessage || t("PLUGINS.PAGE_PLUGIN_MANAGER.NO_PLUGINS_AVAILABLE")}</Trans>
			</EmptyBlock>
		);
	}

	const pagePlugins = chunk(plugins, itemsPerPage)[currentPage - 1];

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
				<div className="flex justify-center mt-10 w-full">
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
	showPagination: true,
};
