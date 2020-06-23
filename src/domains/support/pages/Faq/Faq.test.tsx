/* eslint-disable @typescript-eslint/require-await */
import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

describe("SupportPage", () => {
	it("should render faq portfolio category page", () => {
		const { container } = render(
			<I18nextProvider i18n={i18n}>
				<Faq articles={faqArticles} />
			</I18nextProvider>,
		);
		expect(container).toMatchSnapshot();
	});
});
