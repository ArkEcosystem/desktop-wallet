import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { renderWithRouter } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { news } from "../../data";
import { News } from "./News";

const history = createMemoryHistory();
const newsURL = `/profiles/${identity.profiles.bob.id}/news`;

describe("News", () => {
	beforeAll(() => {
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
