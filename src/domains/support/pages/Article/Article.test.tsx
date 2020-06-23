/* eslint-disable @typescript-eslint/require-await */
import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { article } from "../../data";
import { Article } from "./Article";

describe("SupportPage", () => {
	it("should render article support page", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Article
					title={article.title}
					category={article.category}
					categoryIcon={article.categoryIcon}
					views={article.views}
					sections={article.sections}
				/>
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render article support page with main image", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Article
					title={article.title}
					category={article.category}
					categoryIcon={article.categoryIcon}
					views={article.views}
					sections={article.sections}
					image={article.image}
				/>
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});
});
