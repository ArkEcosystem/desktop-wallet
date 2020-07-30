/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

const history = createMemoryHistory();

const supportURL = "/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/support";

describe("SupportPage", () => {
	beforeAll(() => {
		beforeAll(async () => {
			await env.bootFromObject(fixtureData);
			await env.persist();
		});
		history.push(supportURL);
	});

	it("should render empty main support page", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<Main />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with categories", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<Main categories={categories} />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with helpful articles", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<Main helpfulArticles={helpfulArticles} />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with popular articles", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<Main popularArticles={popularArticles} />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should render main support page with newest articles", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<Main newestArticles={newestArticles} />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
