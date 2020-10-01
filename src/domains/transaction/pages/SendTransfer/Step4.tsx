import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const SummaryStep = ({
	transaction,
	senderWallet,
}: {
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();

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
			{recipients.length === 1 ? (
				<TransactionDetail
					label={t("TRANSACTION.RECIPIENT")}
					extra={<Avatar size="lg" address={recipients[0].address} />}
				>
					<Address address={recipients[0].address} walletName={recipients[0].walletName} />
				</TransactionDetail>
			) : (
				<TransactionDetail label={t("TRANSACTION.RECIPIENTS_COUNT", { count: recipients.length })}>
					<div className="-my-2">
						<RecipientList recipients={recipients} assetSymbol={currency} variant="condensed" />
					</div>
				</TransactionDetail>
			)}

			<TransactionDetail
				label={t("TRANSACTION.TOTAL_AMOUNT")}
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
				paddingPosition="top"
			>
				<Amount ticker={currency} value={transactionAmount.plus(transaction.fee())} />
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
