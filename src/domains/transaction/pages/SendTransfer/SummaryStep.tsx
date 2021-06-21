import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
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
	senderWallet: Contracts.IReadWriteWallet;
}): JSX.Element => (
	<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
		<TransactionRecipients currency={senderWallet.currency()} recipients={transaction.recipients()} />

		<TransactionAmount
			amount={transaction.amount()}
			currency={senderWallet.currency()}
			isMultiPayment={transaction.recipients().length > 1}
			isSent={true}
		/>

		<TransactionFee currency={senderWallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</TransactionSuccessful>
);
