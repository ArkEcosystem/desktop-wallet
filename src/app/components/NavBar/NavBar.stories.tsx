import React from "react";

import { NavBar } from "./NavBar";

export default { title: "Navigation / NavBar" };

export const Default = () => {
	return (
		<div className="-m-5">
			<NavBar onUserAction={(action: any) => alert(action.label)}></NavBar>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
			<div className="h-64 border-b"></div>
		</div>
	);
};
