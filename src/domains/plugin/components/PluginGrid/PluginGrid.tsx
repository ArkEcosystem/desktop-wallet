import { chunk } from "@arkecosystem/utils";
import { Pagination } from "app/components/Pagination";
import { PluginCard } from "domains/plugin/components/PluginCard";
import React from "react";

import { PluginCardSkeleton } from "../PluginCard/PluginCardSkeleton";

type PluginGridProps = {
	className?: string;
	itemsPerPage?: number;
	onDelete: any;
	onEnable?: (plugin: any) => void;
	onDisable?: (plugin: any) => void;
	onInstall?: (plugin: any) => void;
	onLaunch?: (plugin: any) => void;
	onUpdate?: (plugin: any) => void;
	onSelect: any;
	plugins: any[];
	isLoading?: boolean;
	skeletonsLimit?: number;
	withPagination?: boolean;
};

export const PluginGrid = ({
	className,
	itemsPerPage,
	onDelete,
	onSelect,
	onEnable,
	onDisable,
	onLaunch,
	onInstall,
	onUpdate,
	plugins,
	withPagination,
	isLoading,
	skeletonsLimit = 8,
}: PluginGridProps) => {
	const [currentPage, setCurrentPage] = React.useState(1);
	const entries = [];
	let skeletons = [];

	if (isLoading) {
		skeletons = new Array(skeletonsLimit).fill({});
	}

	if (!isLoading) {
		for (const plugin of plugins) {
			entries.push(
				<PluginCard
					key={plugin.id}
					plugin={plugin}
					onClick={() => onSelect(plugin)}
					onDelete={() => onDelete(plugin)}
					onEnable={() => onEnable?.(plugin)}
					onDisable={() => onDisable?.(plugin)}
					onLaunch={() => onLaunch?.(plugin)}
					onInstall={() => onInstall?.(plugin)}
					onUpdate={() => onUpdate?.(plugin)}
				/>,
			);
		}
	}

	const pageEntries = chunk(entries, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginGrid">
			<div className={`grid grid-cols-4 gap-5 ${className}`}>
				{skeletons.map((_, index) => (
					<PluginCardSkeleton key={index} />
				))}
			</div>

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
