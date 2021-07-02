import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { Image } from "app/components/Image";
import {
	TransactionExplorerLink,
	TransactionNetwork,
	TransactionSender,
	TransactionType,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

interface TransactionSuccessfulProperties {
	children?: React.ReactNode;
	transaction?: DTO.ExtendedSignedTransactionData;
	senderWallet?: Contracts.IReadWriteWallet;
}

export const TransactionSuccessful = ({ children, transaction, senderWallet }: TransactionSuccessfulProperties) => {
	const { t } = useTranslation();

	return (
		<section data-testid="TransactionSuccessful" className="space-y-8">
			<Header title={t("TRANSACTION.SUCCESS.TITLE")} />

			<Image name="TransactionSuccessBanner" domain="transaction" className="w-full" />

			<p className="text-theme-secondary-text">{t("TRANSACTION.SUCCESS.DESCRIPTION")}</p>

			<div>
				{senderWallet && transaction && (
					<>
						<TransactionExplorerLink transaction={transaction} border={false} paddingPosition="bottom" />

						<TransactionType type={transaction.type()} />

						<TransactionNetwork network={senderWallet.network()} />

						<TransactionSender
							address={senderWallet.address()}
							alias={senderWallet.alias()}
							isDelegate={senderWallet.isDelegate() && !senderWallet.isResignedDelegate()}
						/>
					</>
				)}

				{children}
			</div>
		</section>
	);
};
