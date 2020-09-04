import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";

export const FourthStep = ({
	transaction,
	senderWallet,
}: {
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => <TransactionSuccessful transaction={transaction} senderWallet={senderWallet} />;
