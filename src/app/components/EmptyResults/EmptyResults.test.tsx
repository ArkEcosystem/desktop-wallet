import React from "react";
import { render } from "testing-library";

import { EmptyResults } from "./EmptyResults";

describe("EmptyResults", () => {
	it("should render with no texts", () => {
		const { container, asFragment } = render(<EmptyResults />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom title and subtitle", () => {
		const { container, asFragment } = render(
			<EmptyResults title="No results" subtitle="No results found. Refine your search and try again" />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
