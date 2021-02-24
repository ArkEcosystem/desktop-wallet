import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useValidation } from "app/hooks";
import { TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputFee } from "../InputFee";

export const GenerationStep = ({
	fees,
	wallet,
	step = 0.001,
}: {
	fees: Contracts.TransactionFee;
	wallet: ReadWriteWallet;
	step?: number;
}) => {
	const { t } = useTranslation();

	const { common } = useValidation();
	const { getValues, setValue, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		register("fee", common.fee(wallet.balance(), wallet.network()));
		register("secondMnemonic");
		register("wallet");
	}, [register, common, fees, wallet]);

	useEffect(() => {
		const newMnemonic = BIP39.generate();
		setValue("secondMnemonic", newMnemonic);
		setValue("wallet", wallet);
	}, [setValue, wallet]);

	return (
		<section data-testid="SecondSignatureRegistrationForm__generation-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.DESCRIPTION")}
			/>

			<Alert>{t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.WARNING")}</Alert>

			<TransactionSender
				address={wallet.address()}
				alias={wallet.alias()}
				borderPosition="bottom"
				paddingPosition="bottom"
			/>

			<div className="space-y-8">
				<FormField name="fee">
					<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
					<InputFee
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						defaultValue={fee || 0}
						value={fee || 0}
						step={step}
						showFeeOptions={wallet.network().can(Coins.FeatureFlag.MiscellaneousDynamicFees)}
						onChange={(currency) => {
							setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true });
						}}
					/>
				</FormField>
			</div>
		</section>
	);
};
