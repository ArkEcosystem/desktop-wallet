import { snakeCase } from "@arkecosystem/utils";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { SearchBarPluginFilters } from "app/components/SearchBar/SearchBarPluginFilters";
import { useActiveProfile } from "app/hooks/env";
import { InstallPlugin } from "domains/plugin/components/InstallPlugin";
import { PluginGrid } from "domains/plugin/components/PluginGrid";
import { PluginList } from "domains/plugin/components/PluginList";
import { PluginManagerNavigationBar } from "domains/plugin/components/PluginManagerNavigationBar";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { paths } from "../../data";

type PluginManagerHomeProps = {
	onDelete: any;
	onInstall: any;
	viewType: string;
	paths?: any;
};

type PluginManagerProps = {
	paths?: any;
};

const { PluginManagerHomeBanner } = images.plugin.pages.PluginManager;

const PluginManagerHome = ({ onDelete, onInstall, viewType, paths }: PluginManagerHomeProps) => {
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();
	const history = useHistory();

	const handleSelectPlugin = (pluginId: string) =>
		history.push(`/profiles/${activeProfile?.id()}/plugins/${pluginId}`);

	const plugins = [];
	for (let i = 0; i < 4; i++) {
		plugins.push(
			{
				id: `ark-explorer-${i}`,
				name: "ARK Explorer",
				author: "ARK.io",
				category: "utility",
				rating: 4.2,
				version: "1.3.8",
				size: "4.2 MB",
				isInstalled: false,
				isOfficial: true,
			},
			{
				id: `ark-avatars-${i}`,
				name: "ARK Avatars",
				author: "ARK.io",
				category: "other",
				rating: 3.8,
				version: "1.3.8",
				size: "163 KB",
				isInstalled: true,
				isGrant: true,
			},
		);
	}

	return (
		<div>
			<div data-testid="PluginManager__home__featured">
				<div className="flex items-center justify-between mt-8 mb-6">
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
				<div className="flex items-center justify-between mt-8 mb-6">
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
				<div className="flex items-center justify-between mt-8 mb-6">
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

	const [currentView, setCurrentView] = React.useState("home");
	const [viewType, setViewType] = React.useState("grid");
	const [installPlugin, setInstallPlugin] = React.useState(false);
	const activeProfile = useActiveProfile();
	const history = useHistory();

	const handleSelectPlugin = (pluginId: string) =>
		history.push(`/profiles/${activeProfile?.id()}/plugins/${pluginId}`);

	const plugins = [];
	for (let i = 0; i < 10; i++) {
		plugins.push(
			{
				id: `ark-explorer-${i}`,
				name: "ARK Explorer",
				author: "ARK.io",
				category: "utility",
				rating: 4.2,
				version: "1.3.8",
				size: "4.2 MB",
				isInstalled: false,
				isOfficial: true,
			},
			{
				id: `ark-avatars-${i}`,
				name: "ARK Avatars",
				author: "ARK.io",
				category: "other",
				rating: 3.8,
				version: "1.3.8",
				size: "163 KB",
				isInstalled: true,
				isGrant: true,
			},
		);
	}

	return (
		<>
			<Page>
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
								<div className="h-8 pl-8 my-auto ml-8 border-l border-theme-neutral-200" />
								<Button
									data-testid="PluginManager_header--install"
									onClick={() => setInstallPlugin(true)}
								>
									<div className="flex items-center whitespace-no-wrap space-x-2">
										<Icon name="File" width={15} height={15} />
										<span>Install File</span>
									</div>
								</Button>
							</div>
						}
					/>
				</Section>

				<div>
					<div className="-my-5">
						<PluginManagerNavigationBar
							selected={currentView}
							onChange={setCurrentView}
							selectedViewType={viewType}
							onSelectGridView={() => setViewType("grid")}
							onSelectListView={() => setViewType("list")}
						/>
					</div>
				</div>

				<Section>
					<div data-testid={`PluginManager__container--${currentView}`}>
						<div className="flex items-center justify-between" />

						{currentView === "home" && (
							<div>
								<PluginManagerHomeBanner className="w-full mb-8" height="auto" />
								<PluginManagerHome
									paths={paths}
									viewType={viewType}
									onInstall={() => setInstallPlugin(true)}
									onDelete={() => console.log("delete")}
								/>
							</div>
						)}

						{currentView !== "home" && viewType === "grid" && (
							<div>
								<h2 className="font-bold">
									{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}
								</h2>
								<PluginGrid
									plugins={plugins}
									onSelect={handleSelectPlugin}
									onDelete={() => console.log("delete")}
									className="mt-6"
								/>
							</div>
						)}

						{currentView !== "home" && viewType === "list" && (
							<PluginList
								plugins={plugins}
								onInstall={() => setInstallPlugin(true)}
								onDelete={() => console.log("delete")}
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
