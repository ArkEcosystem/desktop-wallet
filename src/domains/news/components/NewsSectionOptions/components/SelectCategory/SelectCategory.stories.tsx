import { categories } from "domains/news/data";
import React from "react";

import { SelectCategory } from "./SelectCategory";

export default { title: "Domains / News / Components / News Section Options / Components / Select Category" };

export const Default = () => (
	<div className="flex space-x-2">
		{categories.map((category, index) => (
			<SelectCategory key={index} defaultChecked={category.isSelected}>
				#{category.name}
			</SelectCategory>
		))}
	</div>
);
