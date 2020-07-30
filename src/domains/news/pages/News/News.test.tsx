import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, renderWithRouter, useDefaultNetMocks } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { news } from "../../data";
import { News } from "./News";

const history = createMemoryHistory();
const newsURL = "/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/news";

describe("News", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();

		history.push(newsURL);
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News news={news} />
			</Route>,
			{
				routes: [newsURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});
});
