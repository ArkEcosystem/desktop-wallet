import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useEnvironmentContext } from "app/contexts";
import { useFees } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
import { VoteList } from "domains/vote/components/VoteList";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({
	unvotes,
	votes,
	wallet,
}: {
	profile: Profile;
	unvotes: ReadOnlyWallet[];
	votes: ReadOnlyWallet[];
	wallet: ReadWriteWallet;
}) => {
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();

	const { findByType } = useFees();
	const form = useFormContext();
	const { getValues, setValue, watch, register } = form;

	const [fees, setFees] = useState<Contracts.TransactionFee>({
		static: "5",
		min: "0",
		avg: "0",
		max: "0",
	});

	useEffect(() => {
		register("fees");
	}, [register]);

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		const setVoteFees = async (senderWallet: ReadWriteWallet) => {
			const voteFees = await findByType(senderWallet.coinId(), senderWallet.networkId(), "vote");

			setFees(voteFees);
			setValue("fees", voteFees);
		};

		setVoteFees(wallet);
	}, [env, setFees, wallet, setValue, findByType]);

	useEffect(() => {
		setValue("fee", fees.avg, { shouldValidate: true, shouldDirty: true });
	}, [setValue, fees]);

	return (
		<section data-testid="SendVote__form-step">
			<Header
				title={t("TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_VOTE.FIRST_STEP.DESCRIPTION")}
			/>

			<TransactionNetwork network={wallet.network()} border={false} paddingPosition="bottom" className="mt-8" />

			<TransactionSender
				address={wallet.address()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
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

			<TransactionDetail>
				<FormField name="fee">
					<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
					<InputFee
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						defaultValue={fee || 0}
						value={fee || 0}
						step={0.01}
						showFeeOptions={wallet.network().can(Coins.FeatureFlag.MiscellaneousDynamicFees)}
						onChange={(currency) => {
							setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true });
						}}
					/>
				</FormField>
			</TransactionDetail>
		</section>
	);
};
