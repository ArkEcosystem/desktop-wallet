import { snakeCase } from "@arkecosystem/utils";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { BestPlugins } from "domains/plugins/components/BestPlugins";
import { FeaturedPlugins } from "domains/plugins/components/FeaturedPlugins";
import { InstallPlugin } from "domains/plugins/components/InstallPlugin";
import { PluginGrid } from "domains/plugins/components/PluginGrid";
import { PluginList } from "domains/plugins/components/PluginList";
import { PluginManagerControls } from "domains/plugins/components/PluginManagerControls";
import { PluginManagerNavigationBar } from "domains/plugins/components/PluginManagerNavigationBar";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginManagerHomeProps = {
	onDelete: any;
	onInstall: any;
	viewType: string;
};

const { PluginManagerHomeBanner } = images.plugin.pages.PluginManager;

const PluginManagerHome = ({ onDelete, onInstall, viewType }: PluginManagerHomeProps) => {
	const { t } = useTranslation();
	const [featuredModalOpen, setFeaturedModalOpen] = React.useState(false);
	const [bestModalOpen, setBestModalOpen] = React.useState(false);

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
			<PluginManagerHomeBanner className="w-full" />
			<FeaturedPlugins isOpen={featuredModalOpen} onClose={() => setFeaturedModalOpen(false)} />
			<BestPlugins isOpen={bestModalOpen} onClose={() => setBestModalOpen(false)} />

			<div data-testid="PluginManager__home__featured">
				<div className="flex items-center justify-between mt-8 mb-6">
					<h2>{t("PLUGINS.PAGE_PLUGIN_MANAGER.FEATURED_PLUGINS")}</h2>

					<span
						data-testid="PluginManager__home__featured__view-more"
						onClick={() => setFeaturedModalOpen(true)}
						className="cursor-pointer text-theme-primary-600 hover:text-theme-primary-500"
					>
						{t("COMMON.VIEW_MORE")}
					</span>
				</div>
				{viewType === "grid" && (
					<PluginGrid plugins={plugins} onSelect={() => console.log("selected")} onDelete={onDelete} />
				)}
				{viewType === "list" && <PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} />}
			</div>

			<div data-testid="PluginManager__home__top-rated">
				<div className="flex items-center justify-between mt-8 mb-6">
					<h2>{t("PLUGINS.PAGE_PLUGIN_MANAGER.TOP_RATED")}</h2>

					<span
						data-testid="PluginManager__home__top-rated__view-more"
						onClick={() => setBestModalOpen(true)}
						className="cursor-pointer text-theme-primary-600 hover:text-theme-primary-500"
					>
						{t("COMMON.VIEW_MORE")}
					</span>
				</div>
				{viewType === "grid" && (
					<PluginGrid plugins={plugins} onSelect={() => console.log("selected")} onDelete={onDelete} />
				)}
				{viewType === "list" && <PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} />}
			</div>

			<div data-testid="PluginManager__home__top-utilities">
				<h2 className="mt-8 mb-6">{t("PLUGINS.PAGE_PLUGIN_MANAGER.TOP_UTILITIES")}</h2>
				{viewType === "grid" && (
					<PluginGrid plugins={plugins} onSelect={() => console.log("selected")} onDelete={onDelete} />
				)}
				{viewType === "list" && <PluginList plugins={plugins} onInstall={onInstall} onDelete={onDelete} />}
			</div>
		</div>
	);
};

export const PluginManager = () => {
	const { t } = useTranslation();
	const [currentView, setCurrentView] = React.useState("home");
	const [viewType, setViewType] = React.useState("grid");
	const [installPlugin, setInstallPlugin] = React.useState(false);
	const [installStep, setInstallStep] = React.useState(1);

	React.useEffect(() => {
		if (installStep === 2) {
			setTimeout(() => setInstallStep(3), 1000);
		}
	}, [installStep]);

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
		<div data-testid="PluginManager">
			<InstallPlugin
				step={installStep}
				isOpen={installPlugin}
				onClose={() => setInstallPlugin(false)}
				onCancel={() => setInstallPlugin(false)}
				onDownload={() => setInstallStep(2)}
				onInstall={() => setInstallPlugin(false)}
			/>

			<div className="border-t-20 border-theme-neutral-100">
				<div className="container relative items-end justify-between mx-auto mt-10 mb-15">
					<div className="inline-block">
						<h1>{t("PLUGINS.PAGE_PLUGIN_MANAGER.TITLE")}</h1>
						<div className="text-theme-neutral-700">{t("PLUGINS.PAGE_PLUGIN_MANAGER.DESCRIPTION")}</div>
					</div>

					<div className="absolute top-0 bottom-0 right-0 flex items-center justify-end mt-12 space-x-3">
						<div className="flex items-end py-2">
							<HeaderSearchBar onSearch={() => console.log("search")}>
								<Icon name="Search" width={20} height={20} className="mr-6" />
							</HeaderSearchBar>
						</div>

						<div>
							<div className="pl-8 border-l border-theme-neutral-200">
								<Button className="whitespace-no-wrap">Install File</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<PluginManagerNavigationBar selected={currentView} onChange={setCurrentView} />

			<div data-testid={`PluginManager__container--${currentView}`} className="container mx-auto mt-16">
				<div className="flex items-center justify-between">
					<h2>{t(`PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.${snakeCase(currentView)?.toUpperCase()}`)}</h2>

					<PluginManagerControls
						onSelectGridView={() => setViewType("grid")}
						onSelectListView={() => setViewType("list")}
						selectedViewType={viewType}
					/>
				</div>

				{currentView === "home" && (
					<PluginManagerHome
						viewType={viewType}
						onInstall={() => setInstallPlugin(true)}
						onDelete={() => console.log("delete")}
					/>
				)}
				{currentView !== "home" && viewType === "grid" && (
					<PluginGrid
						plugins={plugins}
						onSelect={() => console.log("selected")}
						onDelete={() => console.log("delete")}
						className="mt-6"
					/>
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
		</div>
	);
};
