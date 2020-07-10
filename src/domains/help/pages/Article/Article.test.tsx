/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { render } from "testing-library";

import { article } from "../../data";
import { Article } from "./Article";

describe("SupportPage", () => {
	it("should render article support page", () => {
		const { container } = render(
			<Article
				title={article.title}
				category={article.category}
				categoryIcon={article.categoryIcon}
				views={article.views}
				sections={article.sections}
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render article support page with main image", () => {
		const { container } = render(
			<Article
				title={article.title}
				category={article.category}
				categoryIcon={article.categoryIcon}
				views={article.views}
				sections={article.sections}
				image={article.image}
			/>,
		);
		expect(container).toMatchSnapshot();
	});
});
