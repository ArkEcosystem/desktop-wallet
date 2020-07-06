/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { render } from "testing-library";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

describe("SupportPage", () => {
	const history = createMemoryHistory();

	it("should render empty main support page", () => {
		const { container } = render(
			<Router history={history}>
				<Main />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with categories", () => {
		const { container } = render(
			<Router history={history}>
				<Main categories={categories} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with helpful articles", () => {
		const { container } = render(
			<Router history={history}>
				<Main helpfulArticles={helpfulArticles} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with popular articles", () => {
		const { container } = render(
			<Router history={history}>
				<Main popularArticles={popularArticles} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with newest articles", () => {
		const { container } = render(
			<Router history={history}>
				<Main newestArticles={newestArticles} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});
});
