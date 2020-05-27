import * as MagistrateCrypto from "@arkecosystem/core-magistrate-crypto";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { TRANSACTION_TYPES } from "@config";

import store from "@/store";

import { TransactionSigner } from "./transaction-signer";

export class BusinessRegistrationBuilder {
	static async build(
		{ address, fee, asset, passphrase, secondPassphrase, wif, networkWif, multiSignature, nonce },
		isAdvancedFee = false,
		returnObject = false,
	) {
		if (!store.getters["session/network"].constants.aip11) {
			throw new Error("AIP-11 transaction not supported on network");
		}

		const staticFee = store.getters["transaction/staticFee"](TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION, 2);
		if (!isAdvancedFee && fee.isGreaterThan(staticFee)) {
			throw new Error(`Business Registration fee should be smaller than ${staticFee}`);
		}

		const businessRegistrationAsset = {
			name: asset.name,
			website: asset.website,
		};

		if (asset.vat && asset.vat.length) {
			businessRegistrationAsset.vat = asset.vat;
		}

		if (asset.repository && asset.repository.length) {
			businessRegistrationAsset.repository = asset.repository;
		}

		const transaction = new MagistrateCrypto.Builders.BusinessRegistrationBuilder()
			.businessRegistrationAsset(businessRegistrationAsset)
			.fee(fee);

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
