import React from "react";
import { useLocation } from "react-router-dom";

import { NavigationBar } from "../NavigationBar";

type Props = {
	children: React.ReactNode;
};

const hideNavBarFrom = ["/", "/profiles/create"];

export const Layout = ({ children }: Props) => {
	// TODO: Move this logic to NavigationBar
	const { pathname } = useLocation();
	const hideNavigationBar = hideNavBarFrom.includes(pathname);

	return (
		<React.Fragment>
			{!hideNavigationBar && <NavigationBar />}
			{children}
		</React.Fragment>
	);
};
