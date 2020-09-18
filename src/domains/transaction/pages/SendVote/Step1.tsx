import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { InputFee } from "domains/transaction/components/InputFee";
import { VoteList } from "domains/vote/components/VoteList";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({
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
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const form = useFormContext();

	const { getValues, setValue, watch } = form;
	const { senderAddress } = watch();
	const [fees, setFees] = useState<Contracts.TransactionFee>({
		static: "5",
		min: "0",
		avg: "1",
		max: "2",
	});

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	const coinName = wallet.coinId();
	const network = `${coinName} ${wallet.network().name()}`;
	const walletName = profile.wallets().findByAddress(senderAddress)?.alias();

	useEffect(() => {
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		if (senderWallet) {
			const transactionFees = env.fees().findByType(senderWallet.coinId(), senderWallet.networkId(), "vote");

			setFees(transactionFees);

			setValue("fee", transactionFees.avg, { shouldValidate: true, shouldDirty: true });
		}
	}, [env, setFees, setValue, profile, senderAddress]);

	return (
		<section data-testid="SendVote__step--first">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_VOTE.FIRST_STEP.DESCRIPTION")}</div>

			<div className="grid grid-flow-row gap-2 mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								{coinName && <Icon name={coinName} width={20} height={20} />}
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{network}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={senderAddress} />}>
					<div className="mb-2 text-sm font-semibold text-theme-neutral">
						<span className="mr-1">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={senderAddress} walletName={walletName} />
				</TransactionDetail>

				{unvotes.length > 0 && (
					<TransactionDetail label={`${t("TRANSACTION.UNVOTES")} (${unvotes.length})`}>
						<VoteList votes={unvotes} />
					</TransactionDetail>
				)}

				{votes.length > 0 && (
					<TransactionDetail label={`${t("TRANSACTION.VOTES")} (${votes.length})`}>
						<VoteList votes={votes} />
					</TransactionDetail>
				)}

				<TransactionDetail className="pt-6 pb-0">
					<FormField name="fee">
						<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
						<InputFee
							min={fees.min}
							avg={fees.avg}
							max={fees.max}
							defaultValue={fee || 0}
							value={fee || 0}
							step={0.01}
							onChange={(value: any) =>
								setValue("fee", value, { shouldValidate: true, shouldDirty: true })
							}
						/>
					</FormField>
				</TransactionDetail>
			</div>
		</section>
	);
};
