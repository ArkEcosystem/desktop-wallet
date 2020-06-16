// UI Elements
import { Icon } from "app/components/Icon";
import React from "react";
import { NavLink } from "react-router-dom";

type NavigationHeaderProps = {
	title?: string;
	route: string;
};

export const NavigationHeader = ({ title, route }: NavigationHeaderProps) => (
	<div className="flex justify-center w-full h-16 bg-theme-neutral-100 md:px-4">
		<div className="container flex items-center justify-start w-full h-full mx-auto text-sm font-semibold leading-none text-theme-neutral-600">
			<span>
				<NavLink to={route} className="flex font-semibold hover:underline transition-default">
					<Icon name="ArrowBack" width={15} height={15} />
					<span className="ml-3" data-testid="navigation-header__title">
						{title}
					</span>
				</NavLink>
			</span>
		</div>
	</div>
);

NavigationHeader.defaultProps = {
	title: "Empty Title",
	route: "/",
};
