import React from "react";

import { article } from "../../data";
import { Article } from "./Article";

export default {
	title: "Support / Pages / Article",
};

export const Default = () => {
	return (
		<Article
			title={article.title}
			category={article.category}
			categoryIcon={article.categoryIcon}
			views={article.views}
			sections={article.sections}
		/>
	);
};

export const WithImage = () => {
	return (
		<Article
			title={article.title}
			category={article.category}
			categoryIcon={article.categoryIcon}
			views={article.views}
			sections={article.sections}
			image={article.image}
		/>
	);
};
