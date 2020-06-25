import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { balances, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
	it("should render", () => {
		const { container } = render(<Dashboard />);
		expect(container).toMatchSnapshot();
	});

	it("should hide transaction view", () => {
		const { getByTestId, getAllByTestId } = render(<Dashboard wallets={wallets} transactions={transactions} />);
		const filterNetwork = getAllByTestId("dropdown__toggle");
		// const transactionsView = getByTestId("dashboard__transactions-view");

		act(() => {
			fireEvent.click(filterNetwork[0]);
		});

		const toggle = getByTestId("filter-wallets_toggle--transactions");
		act(() => {
			fireEvent.click(toggle);
		});
	});

	it("should render portfolio percentage bar", () => {
		const { container } = render(<Dashboard portfolioPercentages={portfolioPercentages} />);
		expect(container).toMatchSnapshot();
	});

	it("should render portfolio chart", () => {
		const { container } = render(<Dashboard balances={balances} portfolioPercentages={portfolioPercentages} />);
		expect(container).toMatchSnapshot();
	});

	it("should hide portfolio view", () => {
		const { getByTestId, getAllByTestId } = render(
			<Dashboard balances={balances} wallets={wallets} transactions={transactions} />,
		);
		const filterNetwork = getAllByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(filterNetwork[0]);
		});

		const toggle = getByTestId("filter-wallets_toggle--portfolio");
		act(() => {
			fireEvent.click(toggle);
		});
	});
});
