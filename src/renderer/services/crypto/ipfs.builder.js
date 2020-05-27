import { Transactions } from "@arkecosystem/crypto";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { TRANSACTION_TYPES } from "@config";

import store from "@/store";

import { TransactionSigner } from "./transaction-signer";

export class IpfsBuilder {
	static async build(
		{ address, fee, hash, passphrase, secondPassphrase, wif, networkWif, multiSignature, nonce },
		isAdvancedFee = false,
		returnObject = false,
	) {
		if (!store.getters["session/network"].constants.aip11) {
			throw new Error("AIP-11 transaction not supported on network");
		}

		const staticFee = store.getters["transaction/staticFee"](TRANSACTION_TYPES.GROUP_1.IPFS, 1);
		if (!isAdvancedFee && fee.isGreaterThan(staticFee)) {
			throw new Error(`IPFS fee should be smaller than ${staticFee}`);
		}

		const transaction = Transactions.BuilderFactory.ipfs().ipfsAsset(hash).fee(fee);

		passphrase = BIP39.normalize(passphrase);
		secondPassphrase = BIP39.normalize(secondPassphrase);

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
