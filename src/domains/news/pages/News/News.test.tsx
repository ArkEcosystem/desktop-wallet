import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { getDefaultProfileId, renderWithRouter } from "testing-library";

import { news } from "../../data";
import { News } from "./News";

const history = createMemoryHistory();
const newsURL = `/profiles/${getDefaultProfileId()}/news`;

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
