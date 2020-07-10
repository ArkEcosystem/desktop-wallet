import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { LayoutControls } from "app/components/LayoutControls";
import { SearchBarPluginFilters } from "app/components/SearchBar/SearchBarPluginFilters";
import { InstallPlugin } from "domains/plugin/components/InstallPlugin";
import { PluginGrid } from "domains/plugin/components/PluginGrid";
import { PluginList } from "domains/plugin/components/PluginList";
import React from "react";
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
			<div data-testid="PluginsCategory__plugins">
				{viewType === "grid" && (
					<PluginGrid
						plugins={plugins}
						onSelect={() => console.log("selected")}
						onDelete={onDelete}
						withPagination={false}
					/>
				)}
				{viewType === "list" && (
					<PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} withPagination={true} />
				)}
			</div>
		</div>
	);
};

export const PluginsCategory = ({ title, description, initialViewType }: PluginsCategoryProps) => {
	const { t } = useTranslation();
	const [viewType, setViewType] = React.useState(initialViewType);
	const [installPlugin, setInstallPlugin] = React.useState(false);

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
		<div data-testid="PluginsCategory">
			<InstallPlugin
				isOpen={installPlugin}
				onClose={() => setInstallPlugin(false)}
				onCancel={() => setInstallPlugin(false)}
			/>

			<div className="border-t-20 border-theme-neutral-100">
				<div className="container py-16 mx-auto px-14 bg-theme-background">
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
								<div className="h-8 pl-8 my-auto ml-8 border-l border-theme-neutral-200" />
								<Button
									onClick={() => setInstallPlugin(true)}
									data-testid="PluginsCategory_header--install"
								>
									<div className="flex items-center whitespace-no-wrap space-x-2">
										<Icon name="File" width={15} height={15} />
										<span>Install File</span>
									</div>
								</Button>
							</div>
						}
					/>
				</div>
			</div>

			<div className="border-t-20 border-theme-neutral-100">
				<div data-testid={`PluginsCategoryHome__container`} className="container pt-8 mx-auto px-14 ">
					<div className="flex items-center justify-between mt-8 mb-6">
						<h2 className="font-bold">{t("PLUGINS.PAGE_PLUGINS_CATEGORY.LAYOUT_TITLE")}</h2>
						<LayoutControls
							data-testid="PluginManagerControls"
							selectedViewType={viewType}
							onSelectGridView={() => setViewType("grid")}
							onSelectListView={() => setViewType("list")}
						/>
					</div>
					<div className="flex items-center justify-between" />
					<Plugins
						viewType={viewType}
						onInstall={() => setInstallPlugin(true)}
						onDelete={() => console.log("delete")}
					/>
				</div>
			</div>
		</div>
	);
};

PluginsCategory.defaultProps = {
	initialViewType: "list",
};
