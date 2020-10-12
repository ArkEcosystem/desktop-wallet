import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { transactions } from "../../data";
import { Transactions } from "./Transactions";

describe("Transactions", () => {
	it("should render with", () => {
		const { container } = renderWithRouter(<Transactions fetchMoreAction={() => console.log("fetchMoreAction")} />);

		expect(container).toMatchSnapshot();
	});

	it("should render with custom title", () => {
		const { container } = renderWithRouter(
			<Transactions title="Transaction history" fetchMoreAction={() => console.log("fetchMoreAction")} />,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with with transactions", () => {
		const { container } = renderWithRouter(
			<Transactions transactions={transactions} fetchMoreAction={() => console.log("fetchMoreAction")} />,
		);

		expect(container).toMatchSnapshot();
	});
});
