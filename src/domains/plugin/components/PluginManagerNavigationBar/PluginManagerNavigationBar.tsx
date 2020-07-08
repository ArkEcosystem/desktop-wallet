import React from "react";
import { styled } from "twin.macro";

import { PluginManagerControls } from "../PluginManagerControls";
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
	return (
		<NavWrapper data-testid="PluginManagerNavigationBar" className="sticky md:top-24 top-20 bg-theme-neutral-100">
			<div className="container mx-auto flex justify-between items-center">
				<div>
					<ul className="flex h-24">
						{menu &&
							menu.map((menuItem: any, index: number) => (
								<li key={index} className="flex">
									<a
										href="/"
										data-testid={`PluginManagerNavigationBar__${menuItem.name}`}
										onClick={() => onChange(menuItem.name)}
										title={menuItem.title}
										className={`PluginManagerNavigationBar__item flex items-center pl-6 font-bold text-md text-theme-neutral-600 cursor-pointer ${
											selected === menuItem.name ? "active" : ""
										}`}
									>
										<span>{menuItem.title}</span>
										{menuItem.count && (
											<span className="ml-1 text-theme-neutral-400">{menuItem.count}</span>
										)}
										<div className="PluginManagerNavigationBar__menu-divider border-r w-px border-theme-neutral-300 pl-6 h-4" />
									</a>
								</li>
							))}
					</ul>
				</div>
				<div className="flex h-24">
					<a
						href="/"
						data-testid={`PluginManagerNavigationBar__my-plugins`}
						onClick={() => onChange("my-plugins")}
						title="My Plugins"
						className={`PluginManagerNavigationBar__item flex items-center pl-6 font-bold text-md text-theme-neutral-600 cursor-pointer ${
							selected === "my-plugins" ? "active" : ""
						}`}
					>
						<span>MyPlugin</span>
						<span className="ml-1 text-theme-neutral-400">8</span>
					</a>
					<div className="border-r w-px border-theme-neutral-300 mx-8 h-10 my-auto" />
					<PluginManagerControls
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
