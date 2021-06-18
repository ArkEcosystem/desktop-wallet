import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts, DTO } from "@arkecosystem/platform-sdk-profiles";
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
	transaction: DTO.ExtendedSignedTransactionData;
	senderWallet: ProfileContracts.IReadWriteWallet;
}) => {
	// @TODO: this differs per coin, can't be accessed like this
	const recipients = transaction.data().data().asset?.payments?.map((payment: { recipientId: string; amount: number }) => ({
		address: payment.recipientId,
		amount: +payment.amount,
	})) || [{ address: transaction.recipient(), amount: transaction.amount() }];

	const transactionAmount = recipients.reduce(
		(sum: number, { amount }: { amount: number; }) => sum + amount,
		0,
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
