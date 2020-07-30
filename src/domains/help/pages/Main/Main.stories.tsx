import React from "react";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

export default {
	title: "Domains / Help / Pages / Main",
};

export const Default = () => (
	<Main
		categories={categories}
		helpfulArticles={helpfulArticles}
		popularArticles={popularArticles}
		newestArticles={newestArticles}
	/>
);
