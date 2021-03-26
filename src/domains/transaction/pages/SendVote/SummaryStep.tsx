import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { TransactionFee, TransactionVotes } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";

export const SummaryStep = ({
	senderWallet,
	transaction,
	unvotes,
	votes,
}: {
	senderWallet: ProfileContracts.IReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
	unvotes: ProfileContracts.IReadOnlyWallet[];
	votes: ProfileContracts.IReadOnlyWallet[];
}) => (
	<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
		<TransactionVotes votes={votes} unvotes={unvotes} />

		<TransactionFee currency={senderWallet.currency()} value={transaction.fee()} paddingPosition="top" />
	</TransactionSuccessful>
);
