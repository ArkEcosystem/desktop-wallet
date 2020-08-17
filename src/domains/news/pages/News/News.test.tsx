/* eslint-disable @typescript-eslint/require-await */
import { Blockfolio, BlockfolioResponse } from "@arkecosystem/platform-sdk-news";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";
import blockfolioFixture from "tests/fixtures/news/blockfolio.json";

import { assets } from "../../data";
import { translations } from "../../i18n";
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

	beforeEach(() => {
		history.push(newsURL);
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

	it("should navigate on next and previous pages", async () => {
		const { getAllByTestId, getByTestId } = renderWithRouter(
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

		act(() => {
			fireEvent.click(getByTestId("CompactPagination__next"));
		});

		await waitFor(() => {
			expect(getAllByTestId("NewsCard")).toHaveLength(15);
		});

		act(() => {
			fireEvent.click(getByTestId("CompactPagination__previous"));
		});

		await waitFor(() => {
			expect(getAllByTestId("NewsCard")).toHaveLength(15);
		});
	});

	it("should show no results screen", async () => {
		history.push(newsURL);
		const { getAllByTestId, getByTestId, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News defaultAssets={assets} />
			</Route>,
			{
				routes: [newsURL],
				history,
			},
		);

		await waitFor(() => {
			expect(getAllByTestId("NewsCard")).not.toHaveLength(0);
		});

		act(() => {
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "fjdskjfksdjfsdf",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		await waitFor(() => {
			expect(getByTestId("News__empty-results")).toBeTruthy();
		});
	});

	it("should filter by category and coin", async () => {
		const { getAllByTestId, getByTestId, asFragment } = renderWithRouter(
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

		act(() => {
			fireEvent.click(getByTestId(`NewsOptions__category-${translations.CATEGORIES.TECHNICAL}`));
			fireEvent.click(getByTestId("network__option--0"));
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		await waitFor(() => {
			expect(getAllByTestId("NewsCard")).toHaveLength(15);
		});

		expect(asFragment()).toMatchSnapshot();

		// Deselect 'All' categories, filter only by technical category

		act(() => {
			fireEvent.click(getByTestId(`NewsOptions__category-${translations.CATEGORIES.ALL}`));
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		await waitFor(() => {
			expect(getAllByTestId("NewsCard")).toHaveLength(6);
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
