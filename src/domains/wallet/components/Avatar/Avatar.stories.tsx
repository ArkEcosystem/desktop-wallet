import React from "react";

import { Avatar } from "./Avatar";

export default { title: "Wallets / Components / Avatar" };

export const Default = () => {
	return (
		<div className="inline-flex space-x-5">
			<Avatar address="APTz" size="small" />
			<Avatar address="AaAy" size="default" />
			<Avatar address="1Pdj" size="large" />
		</div>
	);
};
