/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { render } from "test-utils";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

describe("SupportPage", () => {
	it("should render faq portfolio category page", () => {
		const { container } = render(<Faq articles={faqArticles} />);
		expect(container).toMatchSnapshot();
	});
});
