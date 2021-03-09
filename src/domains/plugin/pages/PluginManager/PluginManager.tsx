import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { snakeCase } from "@arkecosystem/utils";
import { chunk } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { InstallPlugin } from "domains/plugin/components/InstallPlugin";
import { PluginGrid } from "domains/plugin/components/PluginGrid";
import { PluginList } from "domains/plugin/components/PluginList";
import { PluginManagerNavigationBar } from "domains/plugin/components/PluginManagerNavigationBar";
import { PluginManualInstallModal } from "domains/plugin/components/PluginManualInstallModal/PluginManualInstallModal";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstallConfirmation/PluginUninstallConfirmation";
import { PluginController, usePluginManagerContext } from "plugins";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type PluginManagerHomeProps = {
	onCurrentViewChange: (view: string) => void;
	onDelete: any;
	onSelect: (pluginId: string) => void;
	onEnable: (plugin: any) => void;
	onDisable: (plugin: any) => void;
	onInstall: any;
	onLaunch: (plugin: any) => void;
	viewType: string;
	isLoading?: boolean;
	pluginsByCategory: Record<string, any[]>;
};

const PluginManagerHome = ({
	onCurrentViewChange,
	onDelete,
	onSelect,
	onInstall,
	onLaunch,
	viewType,
	pluginsByCategory,
	onEnable,
	onDisable,
	isLoading,
}: PluginManagerHomeProps) => {
	const { t } = useTranslation();

	const renderPlugins = (plugins: any[], category: string) => {
		if (viewType === "grid") {
			return (
				<PluginGrid
					category={category}
					plugins={plugins}
					onSelect={onSelect}
					onEnable={onEnable}
					onDisable={onDisable}
					onDelete={onDelete}
					onInstall={onInstall}
					onLaunch={onLaunch}
					showPagination={false}
					isLoading={isLoading}
				/>
			);
		}

		return (
			<PluginList
				plugins={plugins}
				onClick={onSelect}
				onLaunch={onLaunch}
				onInstall={onInstall}
				onEnable={onEnable}
				onDisable={onDisable}
				onDelete={onDelete}
				showPagination={false}
			/>
		);
	};

	const categories = ["gaming", "utility", "exchange", "other"];

	return (
		<>
			{categories.map((category: string) => {
				const plugins: any[] = sortByDesc(pluginsByCategory[category] || [], "date").slice(0, 3);

				if (plugins.length < 3 && viewType === "grid") {
					plugins.push(...new Array(3 - plugins.length).fill(undefined));
				}

				return (
					<Section key={category}>
						<div data-testid={`PluginManager__home__${category}`}>
							<div className="flex justify-between items-center mb-6">
								<h2 className="font-bold mb-0">{t(`PLUGINS.CATEGORIES.${category.toUpperCase()}`)}</h2>

								<span
									className="flex items-center font-semibold link space-x-2"
									data-testid={`PluginManager__home__${category}__view-more`}
									onClick={() => onCurrentViewChange(category)}
								>
									<span>{t("COMMON.VIEW_MORE")}</span>
									<Icon name="ChevronRight" width={8} height={8} />
								</span>
							</div>

							{renderPlugins(plugins, category)}
						</div>
					</Section>
				);
			})}
		</>
	);
};

const UpdateAllBanner = ({
	hasUpdateAvailableCount,
	isUpdatingAll,
	handleUpdateAll,
}: {
	hasUpdateAvailableCount: number;
	isUpdatingAll: boolean;
	handleUpdateAll: () => void;
}) => {
	const { t } = useTranslation();

	if (hasUpdateAvailableCount === 0) {
		return null;
	}

	return (
		<EmptyBlock size="sm" className="mt-4">
			<div className="flex items-center w-full justify-between">
				{t("PLUGINS.UPDATE_ALL_NOTICE", { count: hasUpdateAvailableCount })}
				<Button disabled={isUpdatingAll} data-testid="PluginManager__update-all" onClick={handleUpdateAll}>
					{isUpdatingAll ? t("COMMON.UPDATING") : t("PLUGINS.UPDATE_ALL")}
				</Button>
			</div>
		</EmptyBlock>
	);
};

export const PluginManager = () => {
	const { t } = useTranslation();
	const {
		fetchPluginPackages,
		allPlugins,
		isFetchingPackages,
		trigger,
		updatingStats,
		filters,
		filterBy,
	} = usePluginManagerContext();

	const activeProfile = useActiveProfile();
	const history = useHistory();
	const { pluginManager, mapConfigToPluginData, updatePlugin } = usePluginManagerContext();
	const { persist } = useEnvironmentContext();

	const [currentView, setCurrentView] = useState("home");
	const [viewType, setViewType] = useState("grid");

	const [isManualInstallModalOpen, setIsManualInstallModalOpen] = useState(false);
	const [uninstallSelectedPlugin, setUninstallSelectedPlugin] = useState<PluginController | undefined>(undefined);
	const [installSelectedPlugin, setInstallSelectedPlugin] = useState<PluginController | undefined>(undefined);
	const [isUpdatingAll, setIsUpdatingAll] = useState(false);

	const plugins = allPlugins.map(mapConfigToPluginData.bind(null, activeProfile));

	const isAdvancedMode = activeProfile.settings().get(ProfileSetting.AdvancedMode);
	const hasUpdateAvailableCount = plugins.filter((item) => item.hasUpdateAvailable).length;

	useLayoutEffect(() => {
		fetchPluginPackages();
	}, [fetchPluginPackages]);

	const pluginsByCategory = useMemo(() => {
		const result: Record<string, any[]> = {};

		for (const plugin of plugins) {
			/* istanbul ignore else */
			if (!result[plugin.category]) {
				result[plugin.category] = [];
			}

			result[plugin.category].push(plugin);
		}

		return result;
	}, [plugins]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const filteredPackages = useMemo(() => pluginsByCategory[currentView] || [], [
		currentView,
		filters,
		pluginsByCategory,
	]);

	const installedPlugins = pluginManager
		.plugins()
		.all()
		.map((item) => item.config())
		.map(mapConfigToPluginData.bind(null, activeProfile));

	const handleSelectPlugin = (pluginData: any) =>
		history.push(`/profiles/${activeProfile.id()}/plugins/details?pluginId=${pluginData.id}`);

	const handleEnablePlugin = (pluginData: any) => {
		pluginManager.plugins().findById(pluginData.id)?.enable(activeProfile, { autoRun: true });
		persist();
	};

	const handleDisablePlugin = (pluginData: any) => {
		pluginManager.plugins().findById(pluginData.id)?.disable(activeProfile);
		persist();
	};

	const handleDeletePlugin = (pluginData: any) => {
		setUninstallSelectedPlugin(pluginManager.plugins().findById(pluginData.id));
	};

	const handleLaunchPlugin = (pluginData: any) => {
		history.push(`/profiles/${activeProfile.id()}/plugins/view?pluginId=${pluginData.id}`);
		persist();
	};

	const handleManualInstall = (result: { pluginId: string; repositoryURL: string }) => {
		setIsManualInstallModalOpen(false);
		history.push(
			`/profiles/${activeProfile.id()}/plugins/details?pluginId=${result.pluginId}&repositoryURL=${
				result.repositoryURL
			}`,
		);
	};

	const handleUpdate = (pluginData: any) => {
		updatePlugin(pluginData.name);
	};

	const openInstallModalPlugin = (pluginData: any) => {
		setInstallSelectedPlugin(pluginData);
	};

	const onDeletePlugin = () => {
		setUninstallSelectedPlugin(undefined);
		trigger();
	};

	const renderGrid = () => {
		if (currentView === "my-plugins") {
			return (
				<PluginGrid
					plugins={installedPlugins}
					onSelect={handleSelectPlugin}
					onDelete={handleDeletePlugin}
					onEnable={handleEnablePlugin}
					onDisable={handleDisablePlugin}
					onInstall={openInstallModalPlugin}
					onLaunch={handleLaunchPlugin}
					onUpdate={handleUpdate}
					isLoading={isFetchingPackages}
				/>
			);
		}

		return (
			<PluginGrid
				plugins={filteredPackages}
				onSelect={handleSelectPlugin}
				onDelete={handleDeletePlugin}
				onEnable={handleEnablePlugin}
				onDisable={handleDisablePlugin}
				onInstall={openInstallModalPlugin}
				onLaunch={handleLaunchPlugin}
				isLoading={isFetchingPackages}
			/>
		);
	};

	const renderList = () => {
		if (currentView === "my-plugins") {
			return (
				<PluginList
					plugins={installedPlugins}
					onClick={handleSelectPlugin}
					onInstall={openInstallModalPlugin}
					onDelete={handleDeletePlugin}
					onEnable={handleEnablePlugin}
					onDisable={handleDisablePlugin}
					onLaunch={handleLaunchPlugin}
					onUpdate={handleUpdate}
					updatingStats={updatingStats}
					showCategory={true}
				/>
			);
		}

		return (
			<PluginList
				plugins={filteredPackages}
				onClick={handleSelectPlugin}
				onInstall={openInstallModalPlugin}
				onDelete={handleDeletePlugin}
				onEnable={handleEnablePlugin}
				onDisable={handleDisablePlugin}
				onLaunch={handleLaunchPlugin}
			/>
		);
	};

	const handleUpdateAll = async () => {
		setIsUpdatingAll(true);
		const availablePackages = allPlugins
			.map(mapConfigToPluginData.bind(null, activeProfile))
			.filter((pluginData) => pluginData.hasUpdateAvailable);

		const entries = chunk(availablePackages, 2);

		for (const packages of entries) {
			await Promise.allSettled(packages.map((packageData) => updatePlugin(packageData.name)));
		}
		setIsUpdatingAll(false);
	};

	return (
		<>
			<Page profile={activeProfile} isBackDisabled={true}>
				<Section>
					<Header
						title={t("PLUGINS.PAGE_PLUGIN_MANAGER.TITLE")}
						subtitle={t("PLUGINS.PAGE_PLUGIN_MANAGER.DESCRIPTION")}
						extra={
							<div className="flex justify-end items-top">
								<HeaderSearchBar
									defaultQuery={filters.query}
									label={t("COMMON.SEARCH")}
									onSearch={(query) => {
										filterBy({ query });
									}}
								/>
								{isAdvancedMode ? (
									<>
										<div className="pl-8 my-auto ml-8 h-8 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />
										<Button
											data-testid="PluginManager_header--install"
											onClick={() => setIsManualInstallModalOpen(true)}
										>
											<div className="flex items-center space-x-2 whitespace-nowrap">
												<Icon name="File" width={15} height={15} />
												<span>Install from URL</span>
											</div>
										</Button>
									</>
								) : null}
							</div>
						}
					/>
				</Section>

				<PluginManagerNavigationBar
					selected={currentView}
					onChange={setCurrentView}
					selectedViewType={viewType}
					onSelectGridView={() => setViewType("grid")}
					onSelectListView={() => setViewType("list")}
					installedPluginsCount={installedPlugins.length}
					hasUpdatesAvailable={hasUpdateAvailableCount > 0}
				/>

				{currentView === "home" && (
					<PluginManagerHome
						isLoading={isFetchingPackages}
						viewType={viewType}
						pluginsByCategory={pluginsByCategory}
						onCurrentViewChange={setCurrentView}
						onInstall={openInstallModalPlugin}
						onEnable={handleEnablePlugin}
						onDisable={handleDisablePlugin}
						onDelete={handleDeletePlugin}
						onSelect={handleSelectPlugin}
						onLaunch={handleLaunchPlugin}
					/>
				)}

				<Section>
					{currentView !== "home" && (
						<>
							<h2 className="font-bold mb-6">
								{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}
							</h2>

							{currentView === "my-plugins" && (
								<UpdateAllBanner
									hasUpdateAvailableCount={hasUpdateAvailableCount}
									isUpdatingAll={isUpdatingAll}
									handleUpdateAll={handleUpdateAll}
								/>
							)}

							<div data-testid={`PluginManager__container--${currentView}`}>
								{viewType === "grid" ? renderGrid() : renderList()}
							</div>
						</>
					)}
				</Section>
			</Page>

			{installSelectedPlugin && (
				<InstallPlugin
					plugin={installSelectedPlugin}
					isOpen={true}
					onClose={() => setInstallSelectedPlugin(undefined)}
					onCancel={() => setInstallSelectedPlugin(undefined)}
				/>
			)}

			<PluginManualInstallModal
				isOpen={isManualInstallModalOpen}
				onClose={() => setIsManualInstallModalOpen(false)}
				onSuccess={handleManualInstall}
			/>

			{uninstallSelectedPlugin && (
				<PluginUninstallConfirmation
					isOpen={true}
					plugin={uninstallSelectedPlugin}
					profile={activeProfile}
					onClose={() => setUninstallSelectedPlugin(undefined)}
					onDelete={onDeletePlugin}
				/>
			)}
		</>
	);
};
