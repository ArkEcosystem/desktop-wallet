import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const SummaryStep = ({
	senderWallet,
	transaction,
}: {
	senderWallet: Contracts.IReadWriteWallet;
	transaction: DTO.ExtendedSignedTransactionData;
}) => {
	const { t } = useTranslation();

	return (
		<section data-testid="SendDelegateResignation__summary-step" className="space-y-8">
			<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{senderWallet.username()}</TransactionDetail>

				<TransactionFee currency={senderWallet.currency()} value={transaction.fee()} paddingPosition="top" />
			</TransactionSuccessful>
		</section>
	);
};
