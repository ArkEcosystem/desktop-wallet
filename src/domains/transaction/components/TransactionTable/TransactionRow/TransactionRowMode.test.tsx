import { Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TransactionRowMode } from "./TransactionRowMode";

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

describe("TransactionRowMode", () => {
	it("should show sent icon", () => {
		const { getByTestId } = render(<TransactionRowMode transaction={transaction} />);
		expect(getByTestId("TransactionRowMode__Sent")).toBeTruthy();
		expect(getByTestId("Avatar")).toBeTruthy();
	});

	it("should show received icon", () => {
		const { getByTestId } = render(<TransactionRowMode transaction={{ ...transaction, isSent: () => false }} />);
		expect(getByTestId("TransactionRowMode__Received")).toBeTruthy();
	});
});
