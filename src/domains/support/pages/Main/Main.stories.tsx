import React from "react";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

export default {
	title: "Support / Pages / Main",
};

export const Default = () => {
	return (
		<Main
			categories={categories}
			helpfulArticles={helpfulArticles}
			popularArticles={popularArticles}
			newestArticles={newestArticles}
		/>
	);
};
