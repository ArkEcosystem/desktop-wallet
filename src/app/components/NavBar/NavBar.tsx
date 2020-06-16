import { images } from "app/assets/images";
import { Badge } from "app/components/Badge";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";
import { NavLink } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { defaultStyle } from "./style";

const commonAssets = images.common;

type NavbarProps = {
	menu?: any;
	userActions?: any;
	currencyIcon?: any;
	onUserAction?: any;
};

const NavWrapper = styled.nav`
	${defaultStyle}
	${tw`bg-white shadow-md sticky inset-x-0 top-0`}
`;

export const NavBar = ({ menu, userActions, onUserAction, currencyIcon }: NavbarProps) => (
	<NavWrapper aria-labelledby="main menu">
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="relative flex justify-between h-20 md:h-24">
				<div className="flex items-center flex-shrink-0">
					<div className="flex p-2 mr-4 rounded-lg bg-logo">
						<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
					</div>
					<ul className="flex h-20 md:h-24">
						{menu.map((menuItem: any, index: number) => (
							<li key={index} className="flex">
								<NavLink
									to={menuItem.path}
									title={menuItem.title}
									className="flex items-center mx-4 font-bold text-md text-theme-neutral-500"
								>
									{menuItem.title}
								</NavLink>
							</li>
						))}
					</ul>
				</div>

				<div className="flex items-center flex-shrink-0">
					<div className="flex items-center h-full px-6 cursor-pointer text-theme-primary-300">
						<Icon name="Notification" width={22} height={22} />
					</div>

					<div className="h-8 border-r border-theme-neutral-200"></div>
					<div className="flex items-center h-full px-3 -mt-1 cursor-pointer text-theme-primary-300">
						<Icon name="Sent" width={42} height={42} />
					</div>

					<div className="h-8 border-r border-theme-neutral-200"></div>
					<div className="flex items-center h-full px-6 cursor-pointer text-theme-primary-300">
						<Icon name="Receive" width={22} height={22} />
					</div>

					<div className="h-8 border-r border-theme-neutral-200"></div>

					<div className="p-2 ml-4 text-right">
						<div className="text-xs text-theme-neutral-500">Your balance</div>
						<div className="text-sm font-bold text-theme-neutral-700">34,253.75</div>
					</div>

					<div className="flex p-1 cusror-pointer">
						<Dropdown
							onSelect={onUserAction}
							options={userActions}
							toggleContent={(isOpen: boolean) => (
								<div className="cursor-pointer" data-testid="navbar__useractions">
									<Circle className="-mr-1 border-theme-neutral-300" size="large">
										<span className="text-theme-neutral-600">
											<Icon name={currencyIcon}></Icon>
										</span>
									</Circle>
									<Circle
										className="relative rotate-90 bg-theme-primary-600 border-theme-primary-600"
										size="large"
									>
										<span className="text-sm text-theme-background">IO</span>
										<Badge
											className={`transform ${
												isOpen ? "rotate-180" : ""
											} bg-theme-primary-100 border-theme-primary-100 bottom-2 -right-4 text-theme-primary-500`}
											icon="ChevronDown"
											iconWidth={16}
											iconHeight={16}
										/>
									</Circle>
								</div>
							)}
						></Dropdown>
					</div>
				</div>
			</div>
		</div>
	</NavWrapper>
);

NavBar.defaultProps = {
	currencyIcon: "Btc",
	menu: [
		{
			title: "Portfolio",
			path: "/portfolio",
		},
		{
			title: "Plugins",
			path: "/plugins",
		},
		{
			title: "Exchange",
			path: "/exchange",
		},
		{
			title: "News",
			path: "/news",
		},
	],
	userActions: [
		{
			label: "Contacts",
			value: "contacts",
		},
		{
			label: "Settings",
			value: "settings",
		},
		{
			label: "Support",
			value: "support",
		},
		{
			label: "Exit",
			value: "exit",
		},
	],
};
