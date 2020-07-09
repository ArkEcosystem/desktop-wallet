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
		<NavWrapper
			data-testid="PluginManagerNavigationBar"
			className="sticky md:top-24 top-20 bg-theme-neutral-contrast"
		>
			<div className="container flex items-center justify-between mx-auto px-14">
				<div>
					<ul className="flex h-24">
						{menu &&
							menu.map((menuItem: any, index: number) => (
								<li key={index} className="flex">
									<button
										data-testid={`PluginManagerNavigationBar__${menuItem.name}`}
										onClick={() => onChange(menuItem.name)}
										title={menuItem.title}
										className={`PluginManagerNavigationBar__item focus:outline-none lex items-center font-bold text-md text-theme-neutral-600 cursor-pointer ${
											selected === menuItem.name ? "active" : ""
										}`}
									>
										<span>{menuItem.title}</span>
										{menuItem.count && (
											<span className="ml-1 text-theme-neutral-light">{menuItem.count}</span>
										)}
									</button>

									{index < menu.length - 1 && (
										<div className="w-px h-4 mx-6 my-auto border-r PluginManagerNavigationBar__menu-divider border-theme-neutral-300" />
									)}
								</li>
							))}
					</ul>
				</div>

				<div className="flex h-24">
					<button
						data-testid={`PluginManagerNavigationBar__my-plugins`}
						onClick={() => onChange("my-plugins")}
						title="My Plugins"
						className={`PluginManagerNavigationBar__item focus:outline-none flex items-center font-bold text-md text-theme-neutral-600 cursor-pointer ${
							selected === "my-plugins" ? "active" : ""
						}`}
					>
						<span>MyPlugin</span>
						<span className="ml-1 text-theme-neutral-light">8</span>
					</button>

					<div className="w-px h-10 mx-8 my-auto border-r border-theme-neutral-300" />

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
