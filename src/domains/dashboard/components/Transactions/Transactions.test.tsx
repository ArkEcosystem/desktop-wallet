import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { transactions } from "../../data";
import { Transactions } from "./Transactions";

describe("Transactions", () => {
	it("should render with", () => {
		const { container } = renderWithRouter(<Transactions />);
		expect(container).toMatchSnapshot();
	});

	it("should render with with transactions", () => {
		const { container } = renderWithRouter(<Transactions transactions={transactions} />);
		expect(container).toMatchSnapshot();
	});
});
