import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { evaluateFee } from "domains/transaction/utils";
import { VoteList } from "domains/vote/components/VoteList";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const VoteLedgerReview = ({
	wallet,
	votes,
	unvotes,
}: {
	wallet: ReadWriteWallet;
	votes: ReadOnlyWallet[];
	unvotes: ReadOnlyWallet[];
}) => {
	const { getValues } = useFormContext();
	const { t } = useTranslation();

	const fee = getValues("fee");

	return (
		<>
			{unvotes.length > 0 && (
				<TransactionDetail label={t("TRANSACTION.UNVOTES_COUNT", { count: unvotes.length })} border={false}>
					<VoteList votes={unvotes} />
				</TransactionDetail>
			)}

			{votes.length > 0 && (
				<TransactionDetail
					label={t("TRANSACTION.VOTES_COUNT", { count: votes.length })}
					border={!!unvotes.length}
				>
					<VoteList votes={votes} />
				</TransactionDetail>
			)}

			<div className="mt-2">
				<TotalAmountBox fee={evaluateFee(fee)} ticker={wallet.currency()} />
			</div>
		</>
	);
};
