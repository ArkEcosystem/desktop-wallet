/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

const history = createMemoryHistory();

const fixtureProfileId = "b999d134-7a24-481e-a95d-bc47c543bfc9";
const categoryURL = `/profiles/${fixtureProfileId}/support/categories/portfolio`;

describe("Faq", () => {
	beforeAll(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();

		history.push(categoryURL);
	});

	it("should render faq portfolio category page", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support/categories/:categoryId">
				<Faq articles={faqArticles} />
			</Route>,
			{
				routes: [categoryURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
