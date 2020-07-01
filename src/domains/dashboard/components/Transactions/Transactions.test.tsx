import React from "react";
import { render } from "test-utils";

import { transactions } from "../../data";
import { Transactions } from "./Transactions";

describe("Transactions", () => {
	it("should render with", () => {
		const { container } = render(<Transactions />);
		expect(container).toMatchSnapshot();
	});

	it("should render with with transactions", () => {
		const { container } = render(<Transactions transactions={transactions} />);
		expect(container).toMatchSnapshot();
	});
});
