/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

describe("SupportPage", () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	it("should render empty main support page", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support">
					<Main />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with categories", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support">
					<Main categories={categories} />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with helpful articles", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support">
					<Main helpfulArticles={helpfulArticles} />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with popular articles", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support">
					<Main popularArticles={popularArticles} />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with newest articles", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/support">
					<Main newestArticles={newestArticles} />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});
});
