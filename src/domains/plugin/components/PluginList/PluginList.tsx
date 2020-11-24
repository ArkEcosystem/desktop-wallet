import { chunk } from "@arkecosystem/utils";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import { PluginListItem } from "domains/plugin/components/PluginListItem";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type PluginListProps = {
	className?: string;
	itemsPerPage?: number;
	onDisable?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onLaunch?: (plugin: any) => void;
	onInstall: any;
	plugins: any[];
	withPagination?: boolean;
	showRating?: boolean;
};

export const PluginList = ({
	className,
	itemsPerPage,
	onDisable,
	onEnable,
	onInstall,
	onLaunch,
	plugins,
	withPagination,
	showRating,
}: PluginListProps) => {
	const { t } = useTranslation();

	const [currentPage, setCurrentPage] = React.useState(1);

	const columns = useMemo(() => {
		const data: any[] = [
			{
				Header: "Logo",
				disableSortBy: true,
				className: "hidden",
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
		];

		if (showRating) {
			data.push({
				Header: t("COMMON.RATING"),
				accessor: "rating",
			});
		}

		data.push(
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
		);

		return data;
	}, [showRating, t]);

	const pagePlugins = chunk(plugins, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginList" className={className}>
			<Table columns={columns} data={pagePlugins}>
				{(plugin: any) => (
					<PluginListItem
						plugin={plugin}
						onInstall={onInstall}
						onDisable={onDisable}
						onEnable={onEnable}
						onLaunch={onLaunch}
						showRating={showRating}
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
	showRating: true,
};
