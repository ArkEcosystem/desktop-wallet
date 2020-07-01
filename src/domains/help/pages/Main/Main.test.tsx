/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { render } from "test-utils";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

describe("SupportPage", () => {
	it("should render empty main support page", () => {
		const { container } = render(<Main />);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with categories", () => {
		const { container } = render(<Main categories={categories} />);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with helpful articles", () => {
		const { container } = render(<Main helpfulArticles={helpfulArticles} />);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with popular articles", () => {
		const { container } = render(<Main popularArticles={popularArticles} />);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with newest articles", () => {
		const { container } = render(<Main newestArticles={newestArticles} />);
		expect(container).toMatchSnapshot();
	});
});
