/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { render } from "testing-library";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

describe("SupportPage", () => {
	const history = createMemoryHistory();

	it("should render faq portfolio category page", () => {
		const { container } = render(
			<Router history={history}>
				<Faq articles={faqArticles} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});
});
