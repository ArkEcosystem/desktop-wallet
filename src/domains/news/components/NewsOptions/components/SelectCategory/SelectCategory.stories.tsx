import { AVAILABLE_CATEGORIES } from "domains/news/data";
import React from "react";

import { SelectCategory } from "./SelectCategory";

export default { title: "Domains / News / Components / News Options / Components / Select Category" };

export const Default = () => (
	<div className="flex space-x-2">
		{AVAILABLE_CATEGORIES.map((category, index) => {
			const option = {
				name: category,
				isSelected: false,
			};

			return (
				<SelectCategory key={index} defaultChecked={option.isSelected}>
					#{option.name}
				</SelectCategory>
			);
		})}
	</div>
);
