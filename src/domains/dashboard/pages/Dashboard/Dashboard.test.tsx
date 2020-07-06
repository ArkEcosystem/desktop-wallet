import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { act, fireEvent, render } from "testing-library";

import { balances, portfolioPercentages, transactions, wallets } from "../../data";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
	const history = createMemoryHistory();

	it("should render", () => {
		const { container } = render(
			<Router history={history}>
				<Dashboard />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should hide transaction view", () => {
		const { getByTestId, getAllByTestId } = render(
			<Router history={history}>
				<Dashboard wallets={wallets} transactions={transactions} />
			</Router>,
		);
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
		const { container } = render(
			<Router history={history}>
				<Dashboard portfolioPercentages={portfolioPercentages} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render portfolio chart", () => {
		const { container } = render(
			<Router history={history}>
				<Dashboard balances={balances} portfolioPercentages={portfolioPercentages} />
			</Router>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should hide portfolio view", () => {
		const { getByTestId, getAllByTestId } = render(
			<Router history={history}>
				<Dashboard balances={balances} wallets={wallets} transactions={transactions} />
			</Router>,
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
