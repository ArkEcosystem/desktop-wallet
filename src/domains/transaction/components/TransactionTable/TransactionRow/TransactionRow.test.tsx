import { Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { fireEvent, renderWithRouter } from "utils/testing-library";

import { TransactionRow } from "./TransactionRow";

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

describe("TransactionRow", () => {
	it("should show transaction", () => {
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow transaction={transaction} />
				</tbody>
			</table>,
		);
		expect(getByTestId("TransactionRow__ID")).toBeTruthy();
		expect(getByTestId("TransactionRow__timestamp")).toBeTruthy();
		expect(getByTestId("TransactionRowMode")).toBeTruthy();
		expect(getByTestId("address__wallet-address")).toBeTruthy();
		expect(getByTestId("TransactionRowInfo")).toBeTruthy();
		expect(getByTestId("TransactionRowConfirmation")).toBeTruthy();
		expect(getByTestId("TransactionRowAmount")).toBeTruthy();
	});

	it("should show transaction with currency", () => {
		const { getAllByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow transaction={transaction} currencyRate="2" />
				</tbody>
			</table>,
		);
		const amounts = getAllByTestId("TransactionRowAmount");
		expect(amounts).toHaveLength(2);
	});

	it("should show transaction with signature pending", () => {
		const onSign = jest.fn();
		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					<TransactionRow transaction={transaction} currencyRate="2" onSign={onSign} isSignaturePending />
				</tbody>
			</table>,
		);
		fireEvent.click(getByTestId("TransactionRow__sign"));
		expect(onSign).toHaveBeenCalled();
	});
});
