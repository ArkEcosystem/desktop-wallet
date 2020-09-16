import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { assets } from "../../data";
import { AddAssets } from "./AddAssets";

export default { title: "Domains / News / Components / Add Assets" };

export const Default = () => {
	const allAssets = [...Array(27)].map(() => "ARK");

	return (
		<AddAssets
			selectedAssets={assets}
			allAssets={allAssets}
			isOpen={boolean("Is Open", true)}
			onClose={() => alert("closed")}
			onCancel={() => alert("canceled")}
		/>
	);
};
