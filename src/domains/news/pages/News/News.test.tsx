import React from "react";
import { renderWithRouter } from "testing-library";

import { news } from "../../data";
import { News } from "./News";

describe("News", () => {
	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<News news={news} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
