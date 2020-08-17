/* eslint-disable @typescript-eslint/require-await */
import { Blockfolio, BlockfolioResponse } from "@arkecosystem/platform-sdk-news";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";
import blockfolioFixture from "tests/fixtures/news/blockfolio.json";

import { News } from "./News";

const history = createMemoryHistory();
const newsURL = `/profiles/${getDefaultProfileId()}/news`;

let subject: Blockfolio;

describe("News", () => {
	beforeAll(async () => {
		history.push(newsURL);
		nock.disableNetConnect();
		nock("https://platform.ark.io/api")
			.get("/coins/ark/signals")
			.query(true)
			.reply(200, blockfolioFixture)
			.persist();

		subject = new Blockfolio(httpClient);

		window.scrollTo = jest.fn();
	});

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should render", async () => {
		const { getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News />
			</Route>,
			{
				routes: [newsURL],
				history,
			},
		);

		await waitFor(() => {
			expect(getAllByTestId("NewsCard")).toHaveLength(15);
		});
	});

	it("should retrieve blockfolio data using findByCoin", async () => {
		const result: BlockfolioResponse = await subject.findByCoin("ark");

		expect(result.meta).toMatchObject(blockfolioFixture.meta);
		expect(result.data).toMatchObject(blockfolioFixture.data);
	});
});
