import { Transactions } from "@arkecosystem/crypto";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { TRANSACTION_TYPES } from "@config";

import store from "@/store";

import { TransactionSigner } from "./transaction-signer";

export class VoteBuilder {
	static async build(
		{ address, votes, fee, passphrase, secondPassphrase, wif, networkWif, multiSignature, nonce },
		isAdvancedFee = false,
		returnObject = false,
	) {
		const staticFee = store.getters["transaction/staticFee"](TRANSACTION_TYPES.GROUP_1.VOTE, 1);
		if (!isAdvancedFee && fee.isGreaterThan(staticFee)) {
			throw new Error(`Vote fee should be smaller than ${staticFee}`);
		}

		const transaction = Transactions.BuilderFactory.vote().votesAsset(votes).fee(fee);

		if (passphrase) {
			passphrase = BIP39.normalize(passphrase);
		}

		if (secondPassphrase) {
			secondPassphrase = BIP39.normalize(secondPassphrase);
		}

		return TransactionSigner.sign(
			{
				address,
				transaction,
				passphrase,
				secondPassphrase,
				wif,
				networkWif,
				multiSignature,
				nonce,
			},
			returnObject,
		);
	}
}
