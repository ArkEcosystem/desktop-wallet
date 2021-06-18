import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const SummaryStep = ({
	registrationForm,
	transaction,
	senderWallet,
}: {
	registrationForm: any;
	transaction: DTO.ExtendedSignedTransactionData;
	senderWallet: Contracts.IReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			{registrationForm.transactionDetails && (
				<registrationForm.transactionDetails transaction={transaction} translations={t} wallet={senderWallet} />
			)}
		</TransactionSuccessful>
	);
};
