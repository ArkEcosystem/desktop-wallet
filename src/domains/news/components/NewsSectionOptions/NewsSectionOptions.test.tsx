import React from "react";
import { render } from "testing-library";

import { assets, categories } from "../../data";
import { NewsSectionOptions } from "./NewsSectionOptions";

describe("NewsSectionOptions", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<NewsSectionOptions categories={categories} selectedAssets={assets} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
