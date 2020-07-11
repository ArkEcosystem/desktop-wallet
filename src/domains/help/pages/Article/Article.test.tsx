/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { article } from "../../data";
import { Article } from "./Article";

describe("Article", () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	it("should render article support page", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/exchange">
					<Article
						title={article.title}
						category={article.category}
						categoryIcon={article.categoryIcon}
						views={article.views}
						sections={article.sections}
					/>
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render article support page with main image", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/exchange">
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
		);

		expect(container).toMatchSnapshot();
	});
});
