/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { article } from "../../data";
import { Article } from "./Article";

describe("Article", () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	const history = createMemoryHistory();
	const articleURL = "/profiles/qwe123/support/articles/art123";

	history.push(articleURL);

	it("should render article support page", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support/articles/:articleId">
					<Article
						title={article.title}
						category={article.category}
						categoryIcon={article.categoryIcon}
						views={article.views}
						sections={article.sections}
					/>
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [articleURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render article support page with main image", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support/articles/:articleId">
					<Article
						title={article.title}
						category={article.category}
						categoryIcon={article.categoryIcon}
						views={article.views}
						sections={article.sections}
						image={article.image}
					/>
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [articleURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
