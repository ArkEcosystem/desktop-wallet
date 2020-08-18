import React from "react";
import { render } from "testing-library";
import { data } from "tests/fixtures/news/page-1.json";

import { NewsCard } from "./NewsCard";

describe("NewsCard", () => {
	it("should render", () => {
		const { container, asFragment } = render(<NewsCard {...data[0]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with cover image", () => {
		const { container, asFragment } = render(
			<NewsCard {...data[1]} coverImage="https://via.placeholder.com/150" />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
