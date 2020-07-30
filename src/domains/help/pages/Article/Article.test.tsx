/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { article } from "../../data";
import { Article } from "./Article";

const history = createMemoryHistory();

const articleURL = `/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/support/articles/art123`;

describe("Article", () => {
	beforeAll(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();
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
