import React from "react";

import { NavigationBar } from "../NavigationBar";

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<React.Fragment>
			<NavigationBar />
			{children}
		</React.Fragment>
	);
};
