/* eslint-disable @typescript-eslint/require-await */
import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { categories, helpfulArticles, newestArticles, popularArticles } from "../../data";
import { Main } from "./Main";

describe("SupportPage", () => {
	it("should render empty main support page", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Main />
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with categories", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Main categories={categories} />
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with helpful articles", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Main helpfulArticles={helpfulArticles} />
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with popular articles", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Main popularArticles={popularArticles} />
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render main support page with newest articles", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Main newestArticles={newestArticles} />
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});
});
