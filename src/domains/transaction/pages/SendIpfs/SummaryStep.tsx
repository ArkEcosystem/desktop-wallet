import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const SummaryStep = ({
	transaction,
	senderWallet,
}: {
	transaction: DTO.ExtendedSignedTransactionData;
	senderWallet: Contracts.IReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionDetail label={t("TRANSACTION.IPFS_HASH")}>{transaction.hash()}</TransactionDetail>
		</TransactionSuccessful>
	);
};
