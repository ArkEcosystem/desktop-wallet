import React from "react";
import { render } from "testing-library";
import { data } from "tests/fixtures/news/blockfolio.json";

import { NewsCard } from "./NewsCard";

describe("NewsCard", () => {
	it("should render", () => {
		const { container, asFragment } = render(<NewsCard {...data[0]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with cover image", () => {
		const { container, asFragment } = render(<NewsCard {...data[1]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
