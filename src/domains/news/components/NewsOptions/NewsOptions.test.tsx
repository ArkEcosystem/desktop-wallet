import React from "react";
import { render } from "testing-library";

import { assets, categories } from "../../data";
import { NewsOptions } from "./NewsOptions";

describe("NewsOptions", () => {
	it("should render", () => {
		const { container, asFragment } = render(<NewsOptions categories={categories} selectedAssets={assets} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
