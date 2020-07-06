/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { render } from "testing-library";

import { article } from "../../data";
import { Article } from "./Article";

describe("SupportPage", () => {
	const history = createMemoryHistory();

	it("should render article support page", () => {
		const { container } = render(
			<Router history={history}>
				<Article
					title={article.title}
					category={article.category}
					categoryIcon={article.categoryIcon}
					views={article.views}
					sections={article.sections}
				/>
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render article support page with main image", () => {
		const { container } = render(
			<Router history={history}>
				<Article
					title={article.title}
					category={article.category}
					categoryIcon={article.categoryIcon}
					views={article.views}
					sections={article.sections}
					image={article.image}
				/>
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});
});
