import React from "react";

import { assets, categories } from "../../data";
import { NewsOptions } from "./NewsOptions";

export default { title: "Domains / News / Components / News Options" };

export const Default = () => (
	<div className="max-w-sm">
		<NewsOptions defaultCategories={categories} selectedAssets={assets} />
	</div>
);
