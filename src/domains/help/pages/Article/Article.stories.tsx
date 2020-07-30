import React from "react";

import { article } from "../../data";
import { Article } from "./Article";

export default {
	title: "Domains / Help / Pages / Article",
};

export const Default = () => (
	<Article
		title={article.title}
		category={article.category}
		categoryIcon={article.categoryIcon}
		views={article.views}
		sections={article.sections}
	/>
);

export const WithImage = () => (
	<Article
		title={article.title}
		category={article.category}
		categoryIcon={article.categoryIcon}
		views={article.views}
		sections={article.sections}
		image={article.image}
	/>
);
