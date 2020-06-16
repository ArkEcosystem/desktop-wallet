import React from "react";
import { render } from "@testing-library/react";
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
