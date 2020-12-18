import { LayoutControls } from "app/components/LayoutControls";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { defaultStyle } from "./styles";

type PluginManagerNavigationBar = {
	onSelectGridView?: any;
	onSelectListView?: any;
	selectedViewType?: string;
	menu: any[];
	selected: any;
	onChange?: any;
};

const NavWrapper = styled.nav`
	${defaultStyle}
`;

export const PluginManagerNavigationBar = ({
	selected,
	onChange,
	menu,
	onSelectGridView,
	onSelectListView,
	selectedViewType,
}: PluginManagerNavigationBar) => {
	const { t } = useTranslation();

	return (
		<NavWrapper
			data-testid="PluginManagerNavigationBar"
			className="sticky top-20 md:top-24 bg-theme-neutral-contrast dark:bg-theme-neutral-800"
		>
			<div className="container flex justify-between items-center px-14 mx-auto">
				<div>
					<ul className="flex h-24">
						{menu &&
							menu.map((menuItem: any, index: number) => (
								<li key={index} className="flex">
									<button
										data-testid={`PluginManagerNavigationBar__${menuItem.name}`}
										onClick={() => onChange(menuItem.name)}
										title={menuItem.title}
										className={`PluginManagerNavigationBar__item px-1 focus:outline-none lex items-center font-semibold text-md text-theme-secondary-text hover:text-theme-text transition-colors duration-200 cursor-pointer ${
											selected === menuItem.name ? "active" : ""
										}`}
									>
										<span>{menuItem.title}</span>
										{menuItem.count && (
											<span className="ml-1 text-theme-neutral dark:text-theme-neutral-700">
												{menuItem.count}
											</span>
										)}
									</button>

									{index < menu.length - 1 && (
										<div className="my-auto mx-6 w-px h-4 border-r PluginManagerNavigationBar__menu-divider border-theme-neutral-300 dark:border-theme-neutral-800" />
									)}
								</li>
							))}
					</ul>
				</div>

				<div className="flex h-24">
					<button
						data-testid="PluginManagerNavigationBar__my-plugins"
						onClick={() => onChange("my-plugins")}
						title="My Plugins"
						className={`PluginManagerNavigationBar__item px-1 focus:outline-none flex items-center font-semibold text-md text-theme-secondary-text hover:text-theme-text transition-colors duration-200 cursor-pointer ${
							selected === "my-plugins" ? "active" : ""
						}`}
					>
						<span>{t("PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS")}</span>
						<span className="ml-1 text-theme-neutral dark:text-theme-neutral-700">8</span>
					</button>

					<div className="my-auto mx-8 w-px h-10 border-r border-theme-neutral-300 dark:border-theme-neutral-800" />

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
	selected: "home",
	menu: [
		{
			title: "Home",
			name: "home",
		},
		{
			title: "Game",
			name: "game",
			count: 48,
		},
		{
			title: "Utility",
			name: "utility",
			count: 264,
		},
		{
			title: "Themes",
			name: "themes",
			count: 96,
		},
		{
			title: "Other",
			name: "other",
			count: 27,
		},
	],
	selectedViewType: "grid",
};
