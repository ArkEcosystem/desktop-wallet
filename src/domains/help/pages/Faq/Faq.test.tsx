/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { getDefaultProfileId, renderWithRouter } from "testing-library";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

const history = createMemoryHistory();

const categoryURL = `/profiles/${getDefaultProfileId()}/support/categories/portfolio`;

describe("Faq", () => {
	beforeAll(() => {
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
