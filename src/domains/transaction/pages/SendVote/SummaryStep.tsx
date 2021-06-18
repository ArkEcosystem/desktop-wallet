import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { TransactionFee, TransactionVotes } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";

export const SummaryStep = ({
	senderWallet,
	transaction,
	unvotes,
	votes,
}: {
	senderWallet: Contracts.IReadWriteWallet;
	transaction: DTO.ExtendedSignedTransactionData;
	unvotes: Contracts.IReadOnlyWallet[];
	votes: Contracts.IReadOnlyWallet[];
}) => (
	<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
		<TransactionVotes votes={votes} unvotes={unvotes} />

		<TransactionFee currency={senderWallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</TransactionSuccessful>
);
