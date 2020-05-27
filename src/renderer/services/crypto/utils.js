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
}
