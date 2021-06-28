import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useValidation } from "app/hooks";
import { TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TransactionFees } from "types";

import { InputFee } from "../InputFee";

export const GenerationStep = ({
	fees,
	wallet,
	step = 0.001,
	profile,
}: {
	fees: TransactionFees;
	wallet: Contracts.IReadWriteWallet;
	step?: number;
	profile: Contracts.IProfile;
}) => {
	const { t } = useTranslation();

	const { common } = useValidation();
	const { getValues, setValue, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	const inputFeeSettings = getValues("inputFeeSettings") ?? {};

	useEffect(() => {
		register("fee", common.fee(wallet.balance(), wallet.network()));
		register("secondMnemonic");
		register("wallet");
	}, [register, common, fees, wallet]);

	useEffect(() => {
		const newMnemonic = BIP39.generate(
			profile.settings().get<string>(Contracts.ProfileSetting.Bip39Locale, "english"),
			wallet.network().wordCount(),
		);
		setValue("secondMnemonic", newMnemonic);
		setValue("wallet", wallet);
	}, [profile, setValue, wallet]);

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

			<FormField name="fee">
				<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
				<InputFee
					min={fees?.min}
					avg={fees?.avg}
					max={fees?.max}
					loading={!fees}
					value={fee}
					step={step}
					disabled={wallet.network().feeType() !== "dynamic"}
					network={wallet.network()}
					profile={profile}
					onChange={(value) => {
						setValue("fee", value, { shouldValidate: true, shouldDirty: true });
					}}
					viewType={inputFeeSettings.viewType}
					onChangeViewType={(viewType) => {
						setValue(
							"inputFeeSettings",
							{ ...inputFeeSettings, viewType },
							{ shouldValidate: true, shouldDirty: true },
						);
					}}
					simpleValue={inputFeeSettings.simpleValue}
					onChangeSimpleValue={(simpleValue) => {
						setValue(
							"inputFeeSettings",
							{ ...inputFeeSettings, simpleValue },
							{ shouldValidate: true, shouldDirty: true },
						);
					}}
				/>
			</FormField>
		</section>
	);
};
