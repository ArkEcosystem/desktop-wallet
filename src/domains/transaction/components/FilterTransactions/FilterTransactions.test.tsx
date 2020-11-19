import React from "react";
import { render } from "testing-library";

import { FilterTransactions } from "./";

describe("FilterTransactions", () => {
	it("should render", () => {
		const { container } = render(<FilterTransactions />);
		expect(container).toMatchSnapshot();
	});
});
