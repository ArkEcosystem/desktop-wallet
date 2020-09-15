import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useTranslation } from "react-i18next";

type SuccessProps = {
	transaction: SignedTransactionData;
	senderWallet: ReadWriteWallet;
	ipfsData: any;
};
export const FourthStep = ({ transaction, senderWallet, ipfsData }: SuccessProps) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Business" width={20} height={20} />
					</Circle>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_REGISTRATION")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.NAME")}>{ipfsData?.meta?.displayName}</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>{ipfsData.meta.description}</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
				<Link to={ipfsData.meta.website} isExternal>
					{ipfsData.meta.website}
				</Link>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
			>
				1.09660435 ARK
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
