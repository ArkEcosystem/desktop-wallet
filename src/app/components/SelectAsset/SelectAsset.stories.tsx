import React from "react";

import { SelectAsset } from "./SelectAsset";

export default {
	title: "Components / SelectAsset",
};

export const Default = () => {
	// const options = [
	// 	{
	// 		label: "Option 1",
	// 		value: "1",
	// 	},
	// 	{
	// 		label: "Option 2",
	// 		value: "2",
	// 	},
	// 	{
	// 		label: "Option 3",
	// 		value: "3",
	// 	},
	// ];

	return (
		<div className="">
			<div className="mt-10 w-128">
				<SelectAsset />
			</div>
		</div>
	);
};
