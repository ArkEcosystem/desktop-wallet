import { Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { TransactionTable } from "./TransactionTable";

const transactions: Contracts.TransactionDataType[] = [
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		type: () => "transfer",
		timestamp: () => 1596213281,
		confirmations: () => BigNumber.make(10),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(100),
		fee: () => BigNumber.make(21),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => false,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isBusinessRegistration: () => false,
		isBusinessResignation: () => false,
		isBusinessUpdate: () => false,
		isBridgechainRegistration: () => false,
		isBridgechainResignation: () => false,
		isBridgechainUpdate: () => false,
		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
	},
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		type: () => "transfer",
		timestamp: () => 1596213281,
		confirmations: () => BigNumber.make(5),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(52),
		fee: () => BigNumber.make(0.2),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => true,
		isMultiSignature: () => true,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isBusinessRegistration: () => false,
		isBusinessResignation: () => false,
		isBusinessUpdate: () => false,
		isBridgechainRegistration: () => false,
		isBridgechainResignation: () => false,
		isBridgechainUpdate: () => false,
		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
	},
];

describe("TransactionTable", () => {
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
			<TransactionTable transactions={transactions} showSignColumn />,
		);
		expect(getAllByTestId("TransactionRow__sign")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render compact", () => {
		const { getAllByTestId, asFragment } = renderWithRouter(
			<TransactionTable transactions={transactions} isCompact />,
		);
		expect(getAllByTestId("TransactionCompactRow")).toHaveLength(transactions.length);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on the row click", () => {
		const onClick = jest.fn();
		const { getAllByTestId } = renderWithRouter(
			<TransactionTable transactions={transactions} onRowClick={onClick} />,
		);
		const rows = getAllByTestId("TransactionRow");
		fireEvent.click(rows[0]);
		expect(onClick).toHaveBeenCalledWith(transactions[0]);
	});
});
