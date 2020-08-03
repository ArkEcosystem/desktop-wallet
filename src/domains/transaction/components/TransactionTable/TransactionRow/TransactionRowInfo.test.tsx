import { Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TransactionRowInfo } from "./TransactionRowInfo";

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
};

describe("TransactionRowInfo", () => {
	it("should show vendor field", () => {
		const { getByTestId } = render(
			<TransactionRowInfo transaction={{ ...transaction, isMultiSignature: () => false }} vendorField="test" />,
		);
		expect(getByTestId("TransactionRowInfo__vendorField")).toBeTruthy();
	});

	it("should show multi signature", () => {
		const { getByTestId } = render(<TransactionRowInfo transaction={transaction} />);
		expect(getByTestId("TransactionRowInfo__multiSignature")).toBeTruthy();
	});

	it("should show all", () => {
		const { getByTestId } = render(<TransactionRowInfo vendorField="test" transaction={transaction} />);
		expect(getByTestId("TransactionRowInfo__vendorField")).toBeTruthy();
		expect(getByTestId("TransactionRowInfo__multiSignature")).toBeTruthy();
	});
});
