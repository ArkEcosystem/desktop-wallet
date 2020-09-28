import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Amount } from "app/components/Amount";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
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
						extra={
							<Circle className="border-theme-text" size="lg">
								<Icon name="Unvote" width={21} height={21} />
							</Circle>
						}
					>
						{t("TRANSACTION.TRANSACTION_TYPES.UNVOTE")}
					</TransactionDetail>

					<TransactionDetail label={t("TRANSACTION.UNVOTES_COUNT", { count: unvotes.length })}>
						<VoteList votes={unvotes} />
					</TransactionDetail>
				</>
			)}

			{votes.length > 0 && (
				<>
					<TransactionDetail
						label={t("TRANSACTION.TRANSACTION_TYPE")}
						extra={
							<Circle className="border-theme-text" size="lg">
								<Icon name="Vote" width={21} height={21} />
							</Circle>
						}
					>
						{t("TRANSACTION.TRANSACTION_TYPES.VOTE")}
					</TransactionDetail>

					<TransactionDetail label={t("TRANSACTION.VOTES_COUNT", { count: votes.length })}>
						<VoteList votes={votes} />
					</TransactionDetail>
				</>
			)}

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")} className="pb-0">
				<Amount ticker={senderWallet.currency()} value={transaction.fee()} />
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
