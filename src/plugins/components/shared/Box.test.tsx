import React from "react";
import { render } from "utils/testing-library";

import { Box } from "./Box";

describe("Shared Box", () => {
	it("should render", () => {
		const { container } = render(<Box styled={{ color: "black" }} />);
		expect(container).toMatchInlineSnapshot(`
		<div>
		  <div
		    class="sc-bdfBwQ bqrpcP"
		  />
		</div>
	`);
	});
});
