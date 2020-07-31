import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, useDefaultNetMocks } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { news } from "../../data";
import { News } from "./News";

const history = createMemoryHistory();
const newsURL = `/profiles/${getDefaultProfileId()}/news`;

describe("News", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

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
