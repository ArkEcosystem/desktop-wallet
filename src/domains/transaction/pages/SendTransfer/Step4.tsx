import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import {
	TransactionAmount,
	TransactionFee,
	TransactionRecipients,
} from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";

export const SummaryStep = ({
	transaction,
	senderWallet,
}: {
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const recipients = transaction.data().asset?.payments?.map((payment: { recipientId: string; amount: string }) => ({
		address: payment.recipientId,
		amount: BigNumber.make(payment.amount),
	})) || [{ address: transaction.recipient(), amount: transaction.amount() }];

	const transactionAmount = recipients.reduce(
		(sum: BigNumber, recipient: Contracts.MultiPaymentRecipient) => sum.plus(recipient.amount),
		BigNumber.ZERO,
	);

	const currency = senderWallet.currency();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionRecipients currency={currency} recipients={recipients} />

			<TransactionAmount
				amount={transactionAmount}
				currency={currency}
				isMultiPayment={recipients.length > 1}
				isSent={true}
			/>

			<TransactionFee currency={currency} value={transaction.fee()} paddingPosition="top" />
		</TransactionSuccessful>
	);
};
