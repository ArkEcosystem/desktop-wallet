/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { article } from "../../data";
import { Article } from "./Article";

const history = createMemoryHistory();

const articleURL = `/profiles/${identity.profiles.bob.id}/support/articles/art123`;

describe("Article", () => {
	beforeAll(() => {
		history.push(articleURL);
	});

	it("should render article support page", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support/articles/:articleId">
				<Article
					title={article.title}
					category={article.category}
					categoryIcon={article.categoryIcon}
					views={article.views}
					sections={article.sections}
				/>
			</Route>,
			{
				routes: [articleURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render article support page with main image", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support/articles/:articleId">
				<Article
					title={article.title}
					category={article.category}
					categoryIcon={article.categoryIcon}
					views={article.views}
					sections={article.sections}
					image={article.image}
				/>
			</Route>,
			{
				routes: [articleURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
