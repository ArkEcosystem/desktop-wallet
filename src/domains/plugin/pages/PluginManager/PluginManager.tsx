import { snakeCase } from "@arkecosystem/utils";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
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
import { usePluginManagerContext } from "plugins";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { paths } from "../../data";

type PluginManagerHomeProps = {
	onDelete: any;
	onInstall: any;
	viewType: string;
	paths?: any;
	plugins: any[];
};

type PluginManagerProps = {
	paths?: any;
};

const { PluginManagerHomeBanner } = images.plugin.pages.PluginManager;

const PluginManagerHome = ({ onDelete, onInstall, viewType, paths, plugins }: PluginManagerHomeProps) => {
	const activeProfile = useActiveProfile();
	const [blacklist, setBlacklist] = useState<any>([]);

	useEffect(() => {
		setBlacklist(Array.from(activeProfile.plugins().blacklist()));
	}, [activeProfile]);

	const { t } = useTranslation();
	const history = useHistory();

	const handleSelectPlugin = (pluginId: string) =>
		history.push(`/profiles/${activeProfile.id()}/plugins/${pluginId}`);

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
						onSelect={handleSelectPlugin}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
				{viewType === "list" && (
					<PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} withPagination={false} />
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
						onSelect={handleSelectPlugin}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
				{viewType === "list" && (
					<PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} withPagination={false} />
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
						onSelect={handleSelectPlugin}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
				{viewType === "list" && (
					<PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} withPagination={false} />
				)}
			</div>
		</div>
	);
};

export const PluginManager = ({ paths }: PluginManagerProps) => {
	const { t } = useTranslation();
	const { fetchPluginPackages, pluginPackages } = usePluginManagerContext();

	const activeProfile = useActiveProfile();
	const history = useHistory();
	const { pluginManager } = usePluginManagerContext();
	const { persist } = useEnvironmentContext();

	const [currentView, setCurrentView] = useState("home");
	const [viewType, setViewType] = useState("grid");
	const [installPlugin, setInstallPlugin] = useState(false);

	useEffect(() => {
		fetchPluginPackages();
	}, [fetchPluginPackages]);

	const allPackages = pluginPackages.map((config) => config.toObject());

	const filteredPackages = pluginPackages
		.filter((config) => config.hasCategory(currentView))
		.map((config) => config.toObject());

	const installedPlugins = pluginManager
		.plugins()
		.all()
		.map((item) => ({
			...item.config().toObject(),
			isInstalled: true,
			isEnabled: item.isEnabled(activeProfile),
			hasLaunch: item.hooks().hasCommand("service:launch.render"),
		}));

	const handleSelectPlugin = (pluginId: string) =>
		history.push(`/profiles/${activeProfile.id()}/plugins/${pluginId}`);

	const handleEnablePlugin = (pluginData: any) => {
		pluginManager.plugins().findById(pluginData.id)?.enable(activeProfile, { autoRun: true });
		persist();
	};

	const handleDisablePlugin = (pluginData: any) => {
		pluginManager.plugins().findById(pluginData.id)?.disable(activeProfile);
		persist();
	};

	return (
		<>
			<Page profile={activeProfile}>
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
								<div className="pl-8 my-auto ml-8 h-8 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />
								<Button
									data-testid="PluginManager_header--install"
									onClick={() => setInstallPlugin(true)}
								>
									<div className="flex items-center space-x-2 whitespace-nowrap">
										<Icon name="File" width={15} height={15} />
										<span>Install File</span>
									</div>
								</Button>
							</div>
						}
					/>
				</Section>

				<div className="-mb-5">
					<PluginManagerNavigationBar
						selected={currentView}
						onChange={setCurrentView}
						selectedViewType={viewType}
						onSelectGridView={() => setViewType("grid")}
						onSelectListView={() => setViewType("list")}
						installedPluginsCount={installedPlugins.length}
					/>
				</div>

				<Section>
					<div data-testid={`PluginManager__container--${currentView}`}>
						<div className="flex justify-between items-center" />

						{currentView === "home" && (
							<div>
								<PluginManagerHomeBanner className="mb-8 w-full" height="auto" />
								<PluginManagerHome
									paths={paths}
									viewType={viewType}
									plugins={allPackages}
									onInstall={() => setInstallPlugin(true)}
									onDelete={() => console.log("delete")}
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
									onDelete={void 0}
									onEnable={handleEnablePlugin}
									onDisable={handleDisablePlugin}
									className="mt-6"
								/>
							</div>
						)}

						{currentView === "my-plugins" && viewType === "list" && (
							<div>
								<h2 className="font-bold">
									{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}
								</h2>
								<PluginList
									plugins={installedPlugins}
									onInstall={void 0}
									onDelete={void 0}
									onEnable={handleEnablePlugin}
									onDisable={handleDisablePlugin}
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
									onDelete={() => console.log("delete")}
									onEnable={handleEnablePlugin}
									onDisable={handleDisablePlugin}
									className="mt-6"
								/>
							</div>
						)}

						{!["home", "my-plugins"].includes(currentView) && viewType === "list" && (
							<PluginList
								plugins={filteredPackages}
								onInstall={() => setInstallPlugin(true)}
								onDelete={() => console.log("delete")}
								onEnable={handleEnablePlugin}
								onDisable={handleDisablePlugin}
								className="mt-6"
							/>
						)}
					</div>
				</Section>
			</Page>

			<InstallPlugin
				isOpen={installPlugin}
				onClose={() => setInstallPlugin(false)}
				onCancel={() => setInstallPlugin(false)}
			/>
		</>
	);
};

PluginManager.defaultProps = {
	paths,
};
