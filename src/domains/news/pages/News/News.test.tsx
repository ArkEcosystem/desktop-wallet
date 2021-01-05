/* eslint-disable @typescript-eslint/require-await */
import { Blockfolio, BlockfolioResponse } from "@arkecosystem/platform-sdk-news";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { assets } from "../../data";
import { News } from "./News";

const history = createMemoryHistory();
const newsURL = `/profiles/${getDefaultProfileId()}/news`;
import page1Fixture from "tests/fixtures/news/page-1.json";

let subject: Blockfolio;

jest.setTimeout(10000);

describe("News", () => {
	beforeAll(async () => {
		history.push(newsURL);

		nock.disableNetConnect();

		nock("https://platform.ark.io/api")
			.get("/coins/signals?coins=ARK")
			.reply(200, () => {
				const { meta, data } = page1Fixture;
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.get("/coins/signals?coins=ARK&page=1")
			.reply(200, () => {
				const { meta, data } = page1Fixture;
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.get("/coins/signals?coins=ARK&page=2")
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/news/page-2.json");
				return {
					meta,
					data: data.slice(0, 1),
				};
			})
			.get("/coins/signals?coins=ARK&query=NoResult&page=1")
			.reply(200, require("tests/fixtures/news/empty-response.json"))
			.get("/coins/signals?coins=ARK&categories=Technical&query=Hacking&page=1")
			.reply(200, require("tests/fixtures/news/filtered.json"))
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

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });
	});

	it("should retrieve blockfolio data using findByCoin", async () => {
		const result: BlockfolioResponse = await subject.findByCoin({ coins: ["ARK"] });

		expect(result.meta).toMatchObject(page1Fixture.meta);
		expect(result.data).toMatchObject(page1Fixture.data.slice(0, 1));
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

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });

		act(() => {
			fireEvent.click(getByTestId("Pagination__next"));
		});

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });

		act(() => {
			fireEvent.click(getByTestId("Pagination__previous"));
		});

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });
	});

	it("should show no results screen", async () => {
		history.push(newsURL);

		const { getAllByTestId, getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News defaultAssets={assets} />
			</Route>,
			{
				routes: [newsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });

		act(() => {
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "NoResult",
				},
			});
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		await waitFor(() => {
			expect(queryAllByTestId("NewsCard")).toHaveLength(0);
			expect(queryAllByTestId("EmptyResults")).toHaveLength(1);
		});
	});

	it("should filter results based on category query and asset", async () => {
		const { getAllByTestId, getByTestId, getByText, asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News />
			</Route>,
			{
				routes: [newsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });

		act(() => {
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "Hacking",
				},
			});
		});

		for (const category of ["Marketing", "Community", "Emergency"]) {
			act(() => {
				fireEvent.click(getByTestId(`NewsOptions__category-${category}`));
			});
		}

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });

		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.change(getByTestId("NewsOptions__search"), {
				target: {
					value: "",
				},
			});

			fireEvent.click(getByText(commonTranslations.SELECT_ALL));
		});

		act(() => {
			fireEvent.click(getByTestId("NewsOptions__submit"));
		});

		await waitFor(() => expect(getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10000 });

		expect(asFragment()).toMatchSnapshot();
	});
});
