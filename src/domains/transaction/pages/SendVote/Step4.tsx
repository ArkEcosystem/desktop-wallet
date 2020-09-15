import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import { VoteList } from "domains/vote/components/VoteList";
import React from "react";
import { useTranslation } from "react-i18next";

export const FourthStep = ({
	senderWallet,
	transaction,
	unvotes,
	votes,
}: {
	senderWallet: ReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
	unvotes: ReadOnlyWallet[];
	votes: ReadOnlyWallet[];
}) => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			{unvotes.length > 0 && (
				<>
					<TransactionDetail
						label={t("TRANSACTION.TRANSACTION_TYPE")}
						className="pb-0"
						extra={
							<div className="ml-1 text-theme-neutral-900">
								<Circle className="border-theme-neutral-900 bg-theme-background" size="lg">
									<Icon name="Unvote" className="text-xl" />
								</Circle>
							</div>
						}
					>
						{t("TRANSACTION.TRANSACTION_TYPES.UNVOTE")}
					</TransactionDetail>

					<TransactionDetail label={`${t("TRANSACTION.UNVOTES")} (${unvotes.length})`}>
						<VoteList votes={unvotes} />
					</TransactionDetail>
				</>
			)}

			{votes.length > 0 && (
				<>
					<TransactionDetail
						label={t("TRANSACTION.TRANSACTION_TYPE")}
						className="pb-0"
						extra={
							<div className="ml-1 text-theme-neutral-900">
								<Circle className="border-theme-neutral-900 bg-theme-background" size="lg">
									<Icon name="Vote" className="text-xl" />
								</Circle>
							</div>
						}
					>
						{t("TRANSACTION.TRANSACTION_TYPES.VOTE")}
					</TransactionDetail>

					<TransactionDetail label={`${t("TRANSACTION.VOTES")} (${votes.length})`}>
						<VoteList votes={votes} />
					</TransactionDetail>
				</>
			)}

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09660435 ARK</TransactionDetail>
		</TransactionSuccessful>
	);
};
