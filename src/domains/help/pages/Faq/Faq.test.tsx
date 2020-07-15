/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

describe("Faq", () => {
	const history = createMemoryHistory();
	const categoryURL = `/profiles/${identity.profiles.bob.id}/support/categories/portfolio`;

	history.push(categoryURL);

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
