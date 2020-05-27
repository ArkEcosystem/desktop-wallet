import { Managers } from "@arkecosystem/crypto";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import nock from "nock";

import { CryptoUtils } from "@/services/crypto/utils";

beforeEach(() => {
	Managers.configManager.setFromPreset("testnet");

	nock.cleanAll();
});

describe("transactionFromData", () => {
	let transaction;

	beforeEach(() => {
		transaction = {
			amount: BigNumber.make(1).times(1e8),
			fee: BigNumber.make(0.1).times(1e8),
			type: 0,
			typeGroup: 1,
			recipientId: "address-1",
			vendorField: "test vendorfield",
			version: 2,
			network: 23,
			senderPublicKey: "publicKey-1",
			timestamp: 100000,
			nonce: "1",
			signatures: [],
			multiSignature: {
				min: 3,
				publicKeys: [1, 2, 3],
			},
		};
	});

	it("should do a deep clone", () => {
		const clonedTransaction = CryptoUtils.transactionFromData(transaction);
		transaction.amount = BigNumber.make(2).times(1e8);

		expect(clonedTransaction.amount.toString()).toEqual("100000000");
	});

	it("should remove unnecessary properties", () => {
		const clonedTransaction = CryptoUtils.transactionFromData(transaction);

		expect(clonedTransaction.timestamp).toBe(undefined);
		expect(clonedTransaction.multiSignature).toBe(undefined);
	});
});
