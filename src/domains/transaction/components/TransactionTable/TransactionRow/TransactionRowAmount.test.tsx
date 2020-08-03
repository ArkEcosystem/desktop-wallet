import { Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TransactionRowAmount } from "./TransactionRowAmount";

const transaction: Contracts.TransactionDataType = {
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
};

describe("TransactionRowAmount", () => {
	it("should show amount", () => {
		const { getByText } = render(<TransactionRowAmount transaction={{ ...transaction, isSent: () => false }} />);
		expect(getByText("100.00000000")).toBeTruthy();
	});

	it("should show amount as currency", () => {
		const { getByText } = render(<TransactionRowAmount transaction={transaction} currencyRate="2.0" />);
		expect(getByText("242.00")).toBeTruthy();
	});

	it("should show total", () => {
		const { getByText } = render(<TransactionRowAmount transaction={transaction} />);
		expect(getByText("121.00000000")).toBeTruthy();
	});

	it("should show total as currency", () => {
		const { getByText } = render(<TransactionRowAmount transaction={transaction} currencyRate="2.0" />);
		expect(getByText("242.00")).toBeTruthy();
	});
});
