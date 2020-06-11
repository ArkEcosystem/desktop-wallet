import React from "react";
import { NavLink } from "react-router-dom";

// UI Elements
import { Icon } from "app/components/Icon";

type NavigationHeaderProps = {
	title?: string;
	route: string;
};

export const NavigationHeader = ({ title, route }: NavigationHeaderProps) => (
	<div className="h-16 w-full flex justify-center bg-theme-neutral-100 md:px-4">
		<div className="container mx-auto w-full h-full flex items-center justify-start text-sm text-theme-neutral-600 leading-none font-semibold">
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
