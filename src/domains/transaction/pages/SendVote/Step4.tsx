import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

export const FourthStep = ({
	delegate,
	transaction,
	senderWallet,
}: {
	delegate: ReadOnlyWallet;
	transaction: Contracts.SignedTransactionData;
	senderWallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionDetail
				label={t("TRANSACTION.DELEGATE")}
				extra={<Avatar size="lg" address={delegate?.address()} />}
			>
				<Address address={delegate?.address()} walletName={delegate?.username()} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09660435 ARK</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				className="pb-0"
				extra={
					<div className="ml-1 text-theme-neutral-900">
						<Circle className="border-theme-neutral-900 bg-theme-background" size="lg">
							<Icon name="Voted" />
						</Circle>
					</div>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.VOTE")}
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
