import React from "react";
import { render } from "testing-library";

import { news } from "../../data";
import { NewsCard } from "./NewsCard";

describe("NewsCard", () => {
	it("should render", () => {
		const { container, asFragment } = render(<NewsCard {...news[0]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with cover image", () => {
		const { container, asFragment } = render(<NewsCard {...news[1]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
