import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { news } from "../../data";
import { News } from "./News";

describe("News", () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	it("should render", () => {
		const { container } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/news">
					<News news={news} />
				</Route>
			</EnvironmentContext.Provider>,
		);

		expect(container).toMatchSnapshot();
	});
});
