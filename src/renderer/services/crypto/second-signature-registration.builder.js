import { Transactions } from "@arkecosystem/crypto";
import { TRANSACTION_TYPES } from "@config";

import store from "@/store";

import { TransactionSigner } from "./transaction-signer";
import { CryptoUtils } from "./utils";

export class SecondSignatureRegistrationBuilder {
	static async build(
		{ address, fee, passphrase, secondPassphrase, wif, networkWif, multiSignature, nonce },
		isAdvancedFee = false,
		returnObject = false,
	) {
		const staticFee = store.getters["transaction/staticFee"](TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE, 1);
		if (!isAdvancedFee && fee.gt(staticFee)) {
			throw new Error(`Second signature fee should be smaller than ${staticFee}`);
		}

		const transaction = Transactions.BuilderFactory.secondSignature().signatureAsset(secondPassphrase).fee(fee);

		passphrase = CryptoUtils.normalizePassphrase(passphrase);

		return TransactionSigner.sign(
			{
				address,
				transaction,
				passphrase,
				wif,
				networkWif,
				multiSignature,
				nonce,
			},
			returnObject,
		);
	}
}
