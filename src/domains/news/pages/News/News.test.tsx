/* eslint-disable @typescript-eslint/require-await */
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "testing-library";
import page1Fixture from "tests/fixtures/news/page-1.json";

import { assets } from "../../data";
import { News } from "./News";

const history = createMemoryHistory();
const newsURL = `/profiles/${getDefaultProfileId()}/news`;

jest.setTimeout(10_000);

describe("News", () => {
	beforeAll(async () => {
		history.push(newsURL);

		nock.disableNetConnect();

		nock("https://platform.ark.io/api")
			.get("/coins/signals?coins=ARK")
			.reply(200, () => {
				const { meta, data } = page1Fixture;
				return {
					data: data.slice(0, 1),
					meta,
				};
			})
			.get("/coins/signals?coins=ARK&page=1")
			.reply(200, () => {
				const { meta, data } = page1Fixture;
				return {
					data: data.slice(0, 1),
					meta,
				};
			})
			.get("/coins/signals?coins=ARK&page=2")
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/news/page-2.json");
				return {
					data: data.slice(0, 1),
					meta,
				};
			})
			.get("/coins/signals?coins=ARK&query=NoResult&page=1")
			.reply(200, require("tests/fixtures/news/empty-response.json"))
			.get("/coins/signals")
			.query((parameters) => !!parameters.categories)
			.reply(200, require("tests/fixtures/news/filtered.json"))
			.persist();

		window.scrollTo = jest.fn();
	});

	beforeEach(() => {
		history.push(newsURL);
	});

	it("should render", async () => {
		renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News />
			</Route>,
			{
				history,
				routes: [newsURL],
			},
		);

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });
	});

	it("should navigate on next and previous pages", async () => {
		renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News />
			</Route>,
			{
				history,
				routes: [newsURL],
			},
		);

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		fireEvent.click(screen.getByTestId("Pagination__next"));

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		fireEvent.click(screen.getByTestId("Pagination__previous"));

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });
	});

	it("should show no results screen", async () => {
		history.push(newsURL);

		renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News defaultAssets={assets} />
			</Route>,
			{
				history,
				routes: [newsURL],
			},
		);

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		fireEvent.change(screen.getByTestId("NewsOptions__search"), {
			target: {
				value: "NoResult",
			},
		});

		await waitFor(() => expect(screen.getByTestId("NewsOptions__search")).toHaveValue("NoResult"));

		await waitFor(() => expect(screen.queryAllByTestId("NewsCard")).toHaveLength(0));
		await waitFor(() => expect(screen.queryAllByTestId("EmptyResults")).toHaveLength(1));
	});

	it("should filter results based on category query and asset", async () => {
		const { asFragment } = renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News />
			</Route>,
			{
				history,
				routes: [newsURL],
			},
		);

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		fireEvent.change(screen.getByTestId("NewsOptions__search"), {
			target: {
				value: "Hacking",
			},
		});

		await waitFor(() => expect(screen.getByTestId("NewsOptions__search")).toHaveValue("Hacking"));

		for (const category of ["Marketing", "Community", "Emergency"]) {
			fireEvent.click(screen.getByTestId(`NewsOptions__category-${category}`));
		}

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		expect(asFragment()).toMatchSnapshot();

		fireEvent.change(screen.getByTestId("NewsOptions__search"), {
			target: {
				value: "",
			},
		});

		await waitFor(() => expect(screen.getByTestId("NewsOptions__search")).toHaveValue(""));

		fireEvent.click(screen.getByText(commonTranslations.SELECT_ALL));

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show not found with empty coins", async () => {
		renderWithRouter(
			<Route path="/profiles/:profileId/news">
				<News />
			</Route>,
			{
				history,
				routes: [newsURL],
			},
		);

		await waitFor(() => expect(screen.getAllByTestId("NewsCard")).toHaveLength(1), { timeout: 10_000 });

		fireEvent.click(screen.getByTestId("NetworkOption__ARK"));

		await waitFor(() => expect(screen.queryAllByTestId("NewsCard")).toHaveLength(0));
		await waitFor(() => expect(screen.queryAllByTestId("EmptyResults")).toHaveLength(1));
	});
});
