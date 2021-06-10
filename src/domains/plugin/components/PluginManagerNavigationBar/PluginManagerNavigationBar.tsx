import { Badge } from "app/components/Badge";
import { LayoutControls } from "app/components/LayoutControls";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import { usePluginManagerContext } from "plugins";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { defaultStyle } from "./styles";

interface PluginManagerNavigationBar {
	hasUpdatesAvailable: boolean;
	installedPluginsCount: number;
	menu: any[];
	selectedView: any;
	selectedViewType?: string;
	onChange?: any;
	onSelectGridView?: any;
	onSelectListView?: any;
}

const NavWrapper = styled.nav`
	${defaultStyle}
`;

export const PluginManagerNavigationBar = ({
	hasUpdatesAvailable,
	installedPluginsCount,
	menu,
	selectedView,
	selectedViewType,
	onChange,
	onSelectGridView,
	onSelectListView,
}: PluginManagerNavigationBar) => {
	const { t } = useTranslation();
	const { allPlugins } = usePluginManagerContext();
	const countsByCategory = menu.reduce(
		(acc, curr) => ({ ...acc, [curr.name]: allPlugins.filter((pkg) => pkg.hasCategory(curr.name)).length }),
		{},
	);

	return (
		<NavWrapper
			data-testid="PluginManagerNavigationBar"
			className="sticky top-21 bg-theme-secondary-100 dark:bg-black my-4"
		>
			<div className="container flex justify-between items-center px-10 mx-auto">
				<div>
					<ul className="flex h-18">
						{menu &&
							menu.map((menuItem: any, index: number) => (
								<li key={index} className="flex">
									<button
										data-testid={`PluginManagerNavigationBar__${menuItem.name}`}
										onClick={() => onChange(menuItem.name)}
										title={menuItem.title}
										className={cn("PluginManagerNavigationBar__item group", {
											active: selectedView === menuItem.name,
										})}
									>
										<div className="absolute inset-0 -mx-3 rounded ring-theme-primary-400 group-focus:ring-2 group-focus-visible" />
										<span>{menuItem.title}</span>

										{!["latest", "all"].includes(menuItem.name) && (
											<span className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-700">
												{countsByCategory[menuItem.name]}
											</span>
										)}
									</button>

									{index < menu.length - 1 && (
										<div className="my-auto mx-6 w-px h-4 border-r PluginManagerNavigationBar__menu-divider border-theme-secondary-300 dark:border-theme-secondary-800" />
									)}
								</li>
							))}
					</ul>
				</div>

				<div className="flex h-18">
					<div className="relative">
						<button
							data-testid="PluginManagerNavigationBar__my-plugins"
							onClick={() => onChange("my-plugins")}
							title={t("PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS")}
							className={cn("PluginManagerNavigationBar__item group", {
								active: selectedView === "my-plugins",
							})}
						>
							<div className="absolute inset-0 -mx-2 rounded ring-theme-primary-400 group-focus:ring-2 group-focus-visible" />
							<span>{t("PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS")}</span>

							{installedPluginsCount > 0 && (
								<span
									data-testid="PluginManagerNavigationBar__my-plugins__count"
									className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-700"
								>
									{installedPluginsCount}
								</span>
							)}

							{hasUpdatesAvailable && (
								<Tooltip content={t("PLUGINS.NEW_UPDATES_AVAILABLE")}>
									<Badge
										data-testid="PluginManagerNavigationBar_update-badge"
										size="sm"
										className="-mt-3 bg-theme-danger-400"
										position="right"
										noShadow={true}
									/>
								</Tooltip>
							)}
						</button>
					</div>

					<div className="my-auto mx-8 w-px h-10 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />

					<LayoutControls
						data-testid="PluginManagerControls"
						onSelectGridView={onSelectGridView}
						onSelectListView={onSelectListView}
						selectedViewType={selectedViewType}
					/>
				</div>
			</div>
		</NavWrapper>
	);
};

PluginManagerNavigationBar.defaultProps = {
	selectedView: "latest",
	selectedViewType: "grid",
};
