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

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

describe("Faq", () => {
	const history = createMemoryHistory();
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	it("should render faq portfolio category page", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/exchange">
					<Faq articles={faqArticles} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
