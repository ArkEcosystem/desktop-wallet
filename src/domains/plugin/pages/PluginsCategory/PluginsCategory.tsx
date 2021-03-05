import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { LayoutControls } from "app/components/LayoutControls";
import { SearchBarPluginFilters } from "app/components/SearchBar/SearchBarPluginFilters";
import { useActiveProfile } from "app/hooks";
import { InstallPlugin } from "domains/plugin/components/InstallPlugin";
import { PluginGrid } from "domains/plugin/components/PluginGrid";
import { PluginList } from "domains/plugin/components/PluginList";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type PluginsCategoryProps = {
	title: string;
	description?: string;
	initialViewType?: string;
};

type PluginsProps = {
	onDelete: any;
	onInstall: any;
	viewType?: string;
};

const Plugins = ({ onDelete, onInstall, viewType }: PluginsProps) => {
	const plugins = [];

	for (let i = 0; i < 4; i++) {
		plugins.push({
			id: i,
			title: "ARK Explorer",
			author: "ARK.io",
			category: "utility",
			rating: 4.2,
			version: "1.3.8",
			size: "4.2 MB",
			isInstalled: false,
			isOfficial: true,
		});
	}

	for (let i = 5; i < 8; i++) {
		plugins.push({
			id: i,
			title: "ARK Avatars",
			author: "ARK.io",
			category: "other",
			rating: 3.8,
			version: "1.3.8",
			size: "163 KB",
			isInstalled: true,
			isGrant: true,
		});
	}

	return (
		<div>
			<div data-testid="PluginsCategory__plugins">
				{viewType === "grid" && (
					<PluginGrid
						plugins={plugins}
						onSelect={() => console.log("selected")}
						onDelete={onDelete}
						showPagination={false}
					/>
				)}
				{viewType === "list" && (
					<PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} showPagination={true} />
				)}
			</div>
		</div>
	);
};

export const PluginsCategory = ({ title, description, initialViewType }: PluginsCategoryProps) => {
	const activeProfile = useActiveProfile();
	const { t } = useTranslation();

	const [viewType, setViewType] = useState(initialViewType);
	const [installPlugin, setInstallPlugin] = useState(false);

	return (
		<>
			<Page profile={activeProfile}>
				<Section>
					<Header
						title={title}
						subtitle={description}
						extra={
							<div className="flex justify-end items-top">
								<HeaderSearchBar
									label="Search"
									onSearch={() => console.log("search")}
									extra={<SearchBarPluginFilters />}
								/>
								<div className="pl-8 my-auto ml-8 h-8 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />
							</div>
						}
					/>
				</Section>

				<Section>
					<div
						data-testid={`PluginsCategoryHome__container`}
						className="flex justify-between items-center mb-6"
					>
						<h2 className="font-bold">{t("PLUGINS.PAGE_PLUGINS_CATEGORY.LAYOUT_TITLE")}</h2>
						<LayoutControls
							data-testid="PluginManagerControls"
							selectedViewType={viewType}
							onSelectGridView={() => setViewType("grid")}
							onSelectListView={() => setViewType("list")}
						/>
					</div>

					<div className="flex justify-between items-center" />

					<Plugins
						viewType={viewType}
						onInstall={() => setInstallPlugin(true)}
						onDelete={() => console.log("delete")}
					/>
				</Section>
			</Page>

			<InstallPlugin
				plugin={{}}
				isOpen={installPlugin}
				onClose={() => setInstallPlugin(false)}
				onCancel={() => setInstallPlugin(false)}
			/>
		</>
	);
};

PluginsCategory.defaultProps = {
	initialViewType: "list",
};
