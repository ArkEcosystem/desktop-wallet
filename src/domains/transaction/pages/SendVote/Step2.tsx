import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import { evaluateFee } from "domains/transaction/utils";
import { VoteList } from "domains/vote/components/VoteList";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = ({
	profile,
	unvotes,
	votes,
	wallet,
}: {
	profile: Profile;
	unvotes: ReadOnlyWallet[];
	votes: ReadOnlyWallet[];
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { getValues, unregister } = useFormContext();

	const { fee } = getValues();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendVote__step--second" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_VOTE.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_VOTE.SECOND_STEP.DESCRIPTION")}
			/>

			<div>
				<TransactionNetwork network={wallet.network()} border={false} paddingPosition="bottom" />

				<TransactionSender
					address={wallet.address()}
					wallet={wallet}
					labelExtra={t("TRANSACTION.YOUR_ADDRESS")}
				/>

				{unvotes.length > 0 && (
					<TransactionDetail label={t("TRANSACTION.UNVOTES_COUNT", { count: unvotes.length })}>
						<VoteList votes={unvotes} />
					</TransactionDetail>
				)}

				{votes.length > 0 && (
					<TransactionDetail label={t("TRANSACTION.VOTES_COUNT", { count: votes.length })}>
						<VoteList votes={votes} />
					</TransactionDetail>
				)}

				<div className="mt-2">
					<TotalAmountBox fee={evaluateFee(fee)} ticker={wallet.currency()} />
				</div>
			</div>
		</section>
	);
};
