import { chunk } from "@arkecosystem/utils";
import { DropdownOption } from "app/components/Dropdown";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Pagination } from "app/components/Pagination";
import { PluginCard } from "domains/plugin/components/PluginCard";
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

import { PluginCardSkeleton } from "../PluginCard/PluginCardSkeleton";

interface PluginGridProps {
	category?: string;
	className?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	itemsPerPage?: number;
	onDelete: any;
	plugins: any[];
	showPagination?: boolean;
	skeletonsLimit?: number;
	updatingStats?: any;
	onDisable?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onInstall?: (plugin: any) => void;
	onLaunch?: (plugin: any) => void;
	onSelect: any;
	onUpdate?: (plugin: any) => void;
}

export const PluginGrid = ({
	category,
	className,
	emptyMessage,
	isLoading,
	itemsPerPage,
	plugins,
	showPagination,
	skeletonsLimit = 3,
	updatingStats,
	onDelete,
	onDisable,
	onEnable,
	onInstall,
	onLaunch,
	onSelect,
	onUpdate,
}: PluginGridProps) => {
	const { t } = useTranslation();

	const [currentPage, setCurrentPage] = React.useState(1);

	let skeletons = [];

	if (isLoading) {
		skeletons = new Array(skeletonsLimit).fill({});
	}

	const getActions = useCallback(
		(plugin: any) => {
			if (!plugin) {
				return;
			}

			if (plugin.isInstalled) {
				const result: DropdownOption[] = [];

				if (plugin.hasLaunch) {
					result.push({ label: t("COMMON.LAUNCH"), value: "launch" });
				}

				if (plugin.hasUpdateAvailable) {
					result.push({
						label: t("COMMON.UPDATE"),
						value: "update",
						disabled: plugin.isCompatible === false,
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

	if (isLoading) {
		return (
			<div data-testid="PluginGrid">
				<div className={`grid grid-cols-3 gap-4.5 ${className}`}>
					{skeletons.map((_, index) => (
						<PluginCardSkeleton key={index} />
					))}
				</div>
			</div>
		);
	}

	if (!plugins.length) {
		return (
			<EmptyBlock data-testid="PluginGrid__empty-message">
				<Trans>{emptyMessage || t("PLUGINS.PAGE_PLUGIN_MANAGER.NO_PLUGINS_AVAILABLE")}</Trans>
			</EmptyBlock>
		);
	}

	const pagePlugins = chunk(plugins, itemsPerPage!)[currentPage - 1];

	return (
		<div data-testid="PluginGrid">
			<div className={`grid grid-cols-3 gap-4.5 ${className}`}>
				{pagePlugins?.map((plugin: any, index: number) => (
					<PluginCard
						key={plugin?.id || `blank_${index}`}
						actions={getActions(plugin)}
						category={category}
						plugin={plugin}
						isUpdating={updatingStats?.[plugin.name]?.percent !== undefined}
						updatingProgress={updatingStats?.[plugin.name]?.percent}
						onClick={() => onSelect(plugin)}
						onSelect={(action: any) => handlePluginAction(plugin, action)}
					/>
				))}
			</div>

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

PluginGrid.defaultProps = {
	itemsPerPage: 15,
	showPagination: true,
};
