import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const SummaryStep = ({
	senderWallet,
	transaction,
}: {
	senderWallet: ReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
}) => {
	const { t } = useTranslation();

	return (
		<section data-testid="SendDelegateResignation__summary-step" className="space-y-8">
			<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
				<TransactionDetail
					label={t("TRANSACTION.TRANSACTION_TYPE")}
					extra={
						<Circle className="border-theme-text" size="lg">
							<Icon name="DelegateResigned" width={19} height={20} />
						</Circle>
					}
				>
					{t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_RESIGNATION")}
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")}>{senderWallet.username()}</TransactionDetail>

				<TransactionFee currency={senderWallet.currency()} value={transaction.fee()} paddingPosition="top" />
			</TransactionSuccessful>
		</section>
	);
};
