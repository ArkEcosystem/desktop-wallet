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
	onInstall: any;
	plugins: any[];
	withPagination?: boolean;
};

export const PluginList = ({
	className,
	itemsPerPage,
	onDelete,
	onInstall,
	plugins,
	withPagination,
}: PluginListProps) => {
	const { t } = useTranslation();

	const [currentPage, setCurrentPage] = React.useState(1);

	const columns = [
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
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	const pagePlugins = chunk(plugins, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginList" className={className}>
			<Table columns={columns} data={pagePlugins}>
				{(plugin: any) => <PluginListItem plugin={plugin} onInstall={onInstall} onDelete={onDelete} />}
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
