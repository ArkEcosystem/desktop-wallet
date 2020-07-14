import { chunk } from "@arkecosystem/utils";
import { Pagination } from "app/components/Pagination";
import { PluginCard } from "domains/plugin/components/PluginCard";
import React from "react";

type PluginGridProps = {
	className?: string;
	itemsPerPage?: number;
	onDelete: any;
	onSelect: any;
	plugins: any[];
	withPagination?: boolean;
};

export const PluginGrid = ({
	className,
	itemsPerPage,
	onDelete,
	onSelect,
	plugins,
	withPagination,
}: PluginGridProps) => {
	const [currentPage, setCurrentPage] = React.useState(1);
	const entries = [];

	for (const plugin of plugins) {
		entries.push(
			<PluginCard
				key={plugin.id}
				plugin={plugin}
				onClick={() => onSelect(plugin.id)}
				onDelete={() => onDelete(plugin)}
			/>,
		);
	}

	const pageEntries = chunk(entries, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginGrid">
			<div className={`grid grid-cols-4 gap-5 ${className}`}>{pageEntries}</div>

			<div className="flex justify-center mt-4">
				{withPagination && (
					<Pagination
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						totalCount={entries.length}
						onSelectPage={setCurrentPage}
						className="mt-5"
					/>
				)}
			</div>
		</div>
	);
};

PluginGrid.defaultProps = {
	itemsPerPage: 20,
	withPagination: true,
};
