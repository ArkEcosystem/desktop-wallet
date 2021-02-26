import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { snakeCase } from "@arkecosystem/utils";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { SearchBarPluginFilters } from "app/components/SearchBar/SearchBarPluginFilters";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { InstallPlugin } from "domains/plugin/components/InstallPlugin";
import { PluginGrid } from "domains/plugin/components/PluginGrid";
import { PluginList } from "domains/plugin/components/PluginList";
import { PluginManagerNavigationBar } from "domains/plugin/components/PluginManagerNavigationBar";
import { PluginManualInstallModal } from "domains/plugin/components/PluginManualInstallModal/PluginManualInstallModal";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstallConfirmation/PluginUninstallConfirmation";
import { PluginController, usePluginManagerContext } from "plugins";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { paths } from "../../data";

type PluginManagerHomeProps = {
	onDelete: any;
	onSelect: (pluginId: string) => void;
	onEnable: (plugin: any) => void;
	onDisable: (plugin: any) => void;
	onInstall: any;
	onLaunch: (plugin: any) => void;
	viewType: string;
	paths?: any;
	isLoading?: boolean;
	plugins: any[];
};

type PluginManagerProps = {
	paths?: any;
};

const { PluginManagerHomeBanner } = images.plugin.pages.PluginManager;

const PluginManagerHome = ({
	onDelete,
	onSelect,
	onInstall,
	onLaunch,
	viewType,
	paths,
	plugins,
	onEnable,
	onDisable,
	isLoading,
}: PluginManagerHomeProps) => {
	const { t } = useTranslation();

	return (
		<div>
			<div data-testid="PluginManager__home__featured">
				<div className="flex justify-between items-center mt-8 mb-6">
					<h2 className="font-bold">{t("PLUGINS.PAGE_PLUGIN_MANAGER.FEATURED_PLUGINS")}</h2>

					<a
						title={t("PLUGINS.PAGE_PLUGIN_MANAGER.FEATURED_PLUGINS")}
						data-testid="PluginManager__home__featured__view-more"
						className="font-semibold cursor-pointer link"
						href={paths.featured}
					>
						{t("COMMON.VIEW_MORE")}
					</a>
				</div>

				{viewType === "grid" && (
					<PluginGrid
						plugins={plugins}
						onSelect={onSelect}
						onEnable={onEnable}
						onDisable={onDisable}
						onDelete={onDelete}
						onInstall={onInstall}
						onLaunch={onLaunch}
						withPagination={false}
						isLoading={isLoading}
					/>
				)}
				{viewType === "list" && (
					<PluginList
						plugins={plugins}
						onClick={onSelect}
						onLaunch={onLaunch}
						onInstall={onInstall}
						onEnable={onEnable}
						onDisable={onDisable}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
			</div>

			<div data-testid="PluginManager__home__top-rated">
				<div className="flex justify-between items-center mt-8 mb-6">
					<h2 className="font-bold">{t("PLUGINS.PAGE_PLUGIN_MANAGER.TOP_RATED")}</h2>
					<a
						title={t("PLUGINS.PAGE_PLUGIN_MANAGER.TOP_RATED")}
						data-testid="PluginManager__home__top-rated__view-more"
						className="font-semibold cursor-pointer link"
						href={paths.topRated}
					>
						{t("COMMON.VIEW_MORE")}
					</a>
				</div>
				{viewType === "grid" && (
					<PluginGrid
						plugins={plugins}
						onSelect={onSelect}
						onEnable={onEnable}
						onDisable={onDisable}
						onDelete={onDelete}
						onInstall={onInstall}
						onLaunch={onLaunch}
						withPagination={false}
						isLoading={isLoading}
					/>
				)}
				{viewType === "list" && (
					<PluginList
						plugins={plugins}
						onClick={onSelect}
						onInstall={onInstall}
						onLaunch={onLaunch}
						onEnable={onEnable}
						onDisable={onDisable}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
			</div>

			<div data-testid="PluginManager__home__top-utilities">
				<div className="flex justify-between items-center mt-8 mb-6">
					<h2 className="font-bold">{t("PLUGINS.PAGE_PLUGIN_MANAGER.TOP_UTILITIES")}</h2>
					<a
						title={t("PLUGINS.PAGE_PLUGIN_MANAGER.TOP_UTILITIES")}
						data-testid="PluginManager__home__top-utilities__view-more"
						className="font-semibold cursor-pointer link"
						href={paths.topUtilities}
					>
						{t("COMMON.VIEW_MORE")}
					</a>
				</div>
				{viewType === "grid" && (
					<PluginGrid
						plugins={plugins}
						onSelect={onSelect}
						onEnable={onEnable}
						onDisable={onDisable}
						onDelete={onDelete}
						onInstall={onInstall}
						onLaunch={onLaunch}
						withPagination={false}
						isLoading={isLoading}
					/>
				)}
				{viewType === "list" && (
					<PluginList
						plugins={plugins}
						onClick={onSelect}
						onLaunch={onLaunch}
						onInstall={onInstall}
						onEnable={onEnable}
						onDisable={onDisable}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
			</div>
		</div>
	);
};

export const PluginManager = ({ paths }: PluginManagerProps) => {
	const { t } = useTranslation();
	const { fetchPluginPackages, allPlugins, isFetchingPackages, trigger, updatingStats } = usePluginManagerContext();

	const activeProfile = useActiveProfile();
	const history = useHistory();
	const { pluginManager, mapConfigToPluginData, updatePlugin } = usePluginManagerContext();
	const { persist } = useEnvironmentContext();

	const [currentView, setCurrentView] = useState("home");
	const [viewType, setViewType] = useState("grid");

	const [isManualInstallModalOpen, setIsManualInstallModalOpen] = useState(false);
	const [uninstallSelectedPlugin, setUninstallSelectedPlugin] = useState<PluginController | undefined>(undefined);
	const [installSelectedPlugin, setInstallSelectedPlugin] = useState<PluginController | undefined>(undefined);

	const isAdvancedMode = activeProfile.settings().get(ProfileSetting.AdvancedMode);
	const hasUpdateAvailableCount = allPlugins
		.map(mapConfigToPluginData.bind(null, activeProfile))
		.filter((item) => item.hasUpdateAvailable).length;

	useEffect(() => {
		fetchPluginPackages();
	}, [fetchPluginPackages]);

	const homePackages = allPlugins.map(mapConfigToPluginData.bind(null, activeProfile));

	const filteredPackages = useMemo(
		() =>
			allPlugins
				.filter((config) => config.hasCategory(currentView))
				.map(mapConfigToPluginData.bind(null, activeProfile)),
		[currentView], // eslint-disable-line react-hooks/exhaustive-deps
	);

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
									label=""
									onSearch={() => console.log("search")}
									extra={<SearchBarPluginFilters />}
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
				/>

				<Section>
					<div data-testid={`PluginManager__container--${currentView}`}>
						<div className="flex justify-between items-center" />

						{currentView === "home" && (
							<div>
								<PluginManagerHomeBanner className="mb-8 w-full" height="auto" />
								<PluginManagerHome
									isLoading={isFetchingPackages}
									paths={paths}
									viewType={viewType}
									plugins={homePackages}
									onInstall={openInstallModalPlugin}
									onEnable={handleEnablePlugin}
									onDisable={handleDisablePlugin}
									onDelete={handleDeletePlugin}
									onSelect={handleSelectPlugin}
									onLaunch={handleLaunchPlugin}
								/>
							</div>
						)}

						{currentView === "my-plugins" && viewType === "grid" && (
							<div>
								<h2 className="font-bold">
									{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}
								</h2>
								<PluginGrid
									plugins={installedPlugins}
									onSelect={handleSelectPlugin}
									onDelete={handleDeletePlugin}
									onEnable={handleEnablePlugin}
									onDisable={handleDisablePlugin}
									onInstall={openInstallModalPlugin}
									onLaunch={handleLaunchPlugin}
									onUpdate={handleUpdate}
									className="mt-6"
									isLoading={isFetchingPackages}
								/>
							</div>
						)}

						{currentView === "my-plugins" && viewType === "list" && (
							<div className="flex flex-col">
								<h2 className="font-bold">
									{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}
								</h2>

								{hasUpdateAvailableCount > 0 && (
									<EmptyBlock size="sm" className="mt-4">
										<div className="flex items-center w-full justify-between">
											{t("PLUGINS.UPDATE_ALL_NOTICE", { count: hasUpdateAvailableCount })}
											<Button data-testid="PluginManager__update-all">
												{t("PLUGINS.UPDATE_ALL")}
											</Button>
										</div>
									</EmptyBlock>
								)}

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
									className="mt-6"
								/>
							</div>
						)}

						{!["home", "my-plugins"].includes(currentView) && viewType === "grid" && (
							<div>
								<h2 className="font-bold">
									{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}
								</h2>
								<PluginGrid
									plugins={filteredPackages}
									onSelect={handleSelectPlugin}
									onDelete={handleDeletePlugin}
									onEnable={handleEnablePlugin}
									onDisable={handleDisablePlugin}
									onInstall={openInstallModalPlugin}
									onLaunch={handleLaunchPlugin}
									className="mt-6"
									isLoading={isFetchingPackages}
								/>
							</div>
						)}

						{!["home", "my-plugins"].includes(currentView) && viewType === "list" && (
							<PluginList
								plugins={filteredPackages}
								onClick={handleSelectPlugin}
								onInstall={openInstallModalPlugin}
								onDelete={handleDeletePlugin}
								onEnable={handleEnablePlugin}
								onDisable={handleDisablePlugin}
								onLaunch={handleLaunchPlugin}
								className="mt-6"
							/>
						)}
					</div>
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

PluginManager.defaultProps = {
	paths,
};
