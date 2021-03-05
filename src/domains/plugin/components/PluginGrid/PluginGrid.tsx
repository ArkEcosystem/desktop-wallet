import { chunk } from "@arkecosystem/utils";
import { DropdownOption } from "app/components/Dropdown";
import { Pagination } from "app/components/Pagination";
import { PluginCard } from "domains/plugin/components/PluginCard";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

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
	skeletonsLimit = 6,
}: PluginGridProps) => {
	const { t } = useTranslation();

	const [currentPage, setCurrentPage] = React.useState(1);

	const entries = [];
	let skeletons = [];

	if (isLoading) {
		skeletons = new Array(skeletonsLimit).fill({});
	}

	const getActions = useCallback(
		(plugin: any) => {
			if (plugin.isInstalled) {
				const result: DropdownOption[] = [];

				if (plugin.hasLaunch) {
					result.push({ label: t("COMMON.LAUNCH"), value: "launch" });
				}

				if (plugin.hasUpdateAvailable) {
					result.push({
						label: t("COMMON.UPDATE"),
						value: "update",
					});
				}

				if (plugin.isEnabled) {
					result.push({ label: t("COMMON.DISABLE"), value: "disable" });
				} else {
					result.push({ label: t("COMMON.ENABLE"), value: "enable" });
				}

				result.push({ label: t("COMMON.DELETE"), value: "delete" });

				return result;
			}

			return [
				{
					label: t("COMMON.INSTALL"),
					value: "install",
				},
			];
		},
		[t],
	);

	const handlePluginAction = (plugin: any, action: any) => {
		switch (action?.value) {
			case "delete":
				onDelete(plugin);
				break;
			case "enable":
				onEnable?.(plugin);
				break;
			case "disable":
				onDisable?.(plugin);
				break;
			case "launch":
				onLaunch?.(plugin);
				break;
			case "install":
				onInstall?.(plugin);
				break;
			case "update":
				onUpdate?.(plugin);
				break;
		}
	};

	if (!isLoading) {
		for (const plugin of plugins) {
			entries.push(
				<PluginCard
					key={plugin.id}
					actions={getActions(plugin)}
					plugin={plugin}
					onClick={() => onSelect(plugin)}
					onSelect={(action: any) => handlePluginAction(plugin, action)}
				/>,
			);
		}
	}

	const pageEntries = chunk(entries, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginGrid">
			<div className={`grid grid-cols-3 gap-5 ${className}`}>
				{skeletons.map((_, index) => (
					<PluginCardSkeleton key={index} />
				))}
			</div>

			<div className={`grid grid-cols-3 gap-5 ${className}`}>{pageEntries}</div>

			{withPagination && (
				<div className="flex justify-center w-full mt-10">
					<Pagination
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						totalCount={entries.length}
						onSelectPage={setCurrentPage}
					/>
				</div>
			)}
		</div>
	);
};

PluginGrid.defaultProps = {
	itemsPerPage: 20,
	withPagination: true,
};
