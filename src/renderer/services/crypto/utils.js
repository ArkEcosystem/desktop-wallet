import { cloneDeep } from "lodash";

export class CryptoUtils {
	// todo: why do we do a deep clone of a transaction before we sign it?
	static transactionFromData(transaction) {
		const amount = transaction.amount;
		const fee = transaction.fee;

		transaction = cloneDeep(transaction);
		transaction.amount = amount;
		transaction.fee = fee;
		transaction.multiSignature = undefined;
		transaction.timestamp = undefined;

		return transaction;
	}

	/*
	 * Normalizes the passphrase by decomposing any characters (if applicable)
	 * This is mainly used for the korean language where characters are combined while the passphrase was based on the decomposed consonants
	 */
	static normalizePassphrase(passphrase) {
		if (passphrase) {
			return passphrase.normalize("NFD");
		}
	}
}
