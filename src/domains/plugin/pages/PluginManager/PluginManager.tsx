import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { snakeCase } from "@arkecosystem/utils";
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
	plugins: any[];
};

const PluginManagerHome = ({
	onCurrentViewChange,
	onDelete,
	onSelect,
	onInstall,
	onLaunch,
	viewType,
	plugins,
	onEnable,
	onDisable,
	isLoading,
}: PluginManagerHomeProps) => {
	const { t } = useTranslation();

	const renderGrid = () => (
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
	);

	const renderList = () => (
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
	);

	const categories = ["gaming", "utility"];

	return (
		<>
			{categories.map((category: string) => (
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

						{viewType === "grid" ? renderGrid() : renderList()}
					</div>
				</Section>
			))}
		</>
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

	const isAdvancedMode = activeProfile.settings().get(ProfileSetting.AdvancedMode);
	const hasUpdateAvailableCount = allPlugins
		.map(mapConfigToPluginData.bind(null, activeProfile))
		.filter((item) => item.hasUpdateAvailable).length;

	useLayoutEffect(() => {
		fetchPluginPackages();
	}, [fetchPluginPackages]);

	const homePackages = allPlugins.map(mapConfigToPluginData.bind(null, activeProfile));

	const filteredPackages = useMemo(
		() =>
			allPlugins
				.filter((config) => config.hasCategory(currentView))
				.map(mapConfigToPluginData.bind(null, activeProfile)),
		[currentView, filters], // eslint-disable-line react-hooks/exhaustive-deps
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
				/>

				{currentView === "home" && (
					<PluginManagerHome
						isLoading={isFetchingPackages}
						viewType={viewType}
						plugins={homePackages}
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

							{currentView === "my-plugins" && hasUpdateAvailableCount > 0 && (
								<EmptyBlock size="sm" className="my-6">
									<div className="flex items-center w-full justify-between">
										{t("PLUGINS.UPDATE_ALL_NOTICE", { count: hasUpdateAvailableCount })}
										<Button variant="secondary" data-testid="PluginManager__update-all">
											{t("PLUGINS.UPDATE_ALL")}
										</Button>
									</div>
								</EmptyBlock>
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
