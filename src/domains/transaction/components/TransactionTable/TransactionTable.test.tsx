import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { TransactionTable } from "./TransactionTable";
import { Transaction } from "./TransactionTable.models";

describe("TransactionTable", () => {
	const transactions: Transaction[] = [
		{
			id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
			confirmations: "10",
			timestamp: "17 Mar 2020 22:02:10",
			type: "transfer",
			sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			amount: "100",
			fee: "21",
			vendorField: "Test",
			isSent: true,
		},
		{
			id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
			confirmations: "100",
			timestamp: "17 Mar 2020 10:22:05",
			type: "secondSignature",
			sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			amount: "0",
			fee: "0.1",
			isSent: true,
		},
	];

	it("should render", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(<TransactionTable transactions={transactions} />);
		expect(getAllByTestId("TransactionRow")).toHaveLength(transactions.length);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with currency", () => {
		const { getAllByTestId } = renderWithRouter(<TransactionTable transactions={transactions} currencyRate="2" />);
		expect(getAllByTestId("TransactionRow__currency")).toHaveLength(transactions.length);
	});

	it("should render with sign", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<TransactionTable
				transactions={[
					{
						id: "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
						confirmations: "100",
						timestamp: "17 Mar 2020 10:22:05",
						type: "transfer",
						sender: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
						recipient: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
						amount: "52",
						fee: "0.2",
						vendorField: "Test",
						isSent: true,
						isMultiSignature: true,
						isSignaturePending: true,
					},
				]}
				showSignColumn
			/>,
		);
		expect(getAllByTestId("TransactionRow__sign")).toHaveLength(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render compact", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<TransactionTable transactions={transactions} isCompact />,
		);
		expect(getAllByTestId("TransactionCompactRow")).toHaveLength(transactions.length);
		expect(asFragment()).toMatchSnapshot();
	});
});
