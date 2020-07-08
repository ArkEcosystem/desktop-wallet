import React from "react";
import { useLocation } from "react-router-dom";

import { NavigationBar } from "../NavigationBar";

type Props = {
	children: React.ReactNode;
};

const hideNavBarFrom = ["/", "/profiles/create"];

export const Layout = ({ children }: Props) => {
	const { pathname } = useLocation();

	return (
		<React.Fragment>
			{!hideNavBarFrom.includes(pathname) && <NavigationBar />}
			{children}
		</React.Fragment>
	);
};
