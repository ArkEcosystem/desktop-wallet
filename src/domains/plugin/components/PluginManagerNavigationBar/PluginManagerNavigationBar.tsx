import { Badge } from "app/components/Badge";
import { LayoutControls } from "app/components/LayoutControls";
import { Tab, TabList, Tabs } from "app/components/Tabs";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { defaultStyle } from "./styles";

interface Props {
	hasUpdatesAvailable: boolean;
	installedPluginsCount: number;
	menu: any[];
	selectedView: any;
	selectedViewType?: string;
	onChange?: any;
	onSelectGridView?: any;
	onSelectListView?: any;
}

export interface PluginManagerNavigationBarItem {
	name: string;
	title: string;
	count?: number;
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
}: Props) => {
	const { t } = useTranslation();

	return (
		<NavWrapper
			data-testid="PluginManagerNavigationBar"
			className="sticky my-4 dark:bg-black top-21 bg-theme-secondary-100"
		>
			<div className="container flex justify-between items-center px-10 mx-auto">
				<Tabs
					activeId={selectedView}
					className="-mx-6 w-full"
					onChange={(activeTab) => {
						if (activeTab === selectedView) {
							return;
						}

						onChange(activeTab);
					}}
				>
					<TabList className="w-full h-18" noBackground>
						{menu.map(({ title, name, count }: PluginManagerNavigationBarItem) => (
							<Tab tabId={name} key={name} count={count}>
								{title}
							</Tab>
						))}

						<div className="flex flex-1" />

						<Tab tabId="my-plugins" count={installedPluginsCount || undefined}>
							<span>{t("PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS")}</span>
							{hasUpdatesAvailable && (
								<Tooltip content={t("PLUGINS.NEW_UPDATES_AVAILABLE")}>
									<Badge
										data-testid="PluginManagerNavigationBar_update-badge"
										size="sm"
										className="-mt-6.5 bg-theme-danger-400"
										position="right"
										noShadow
									/>
								</Tooltip>
							)}
						</Tab>
					</TabList>
				</Tabs>

				<div className="flex h-18">
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
