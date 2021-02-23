import { FeatureFlag } from "@arkecosystem/platform-sdk/dist/coins";
import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { useValidation } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ fees, wallet, step = 0.001 }: any) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const { delegateRegistration, common } = useValidation();

	const { getValues, register, unregister, setValue, watch } = useFormContext();
	const username = getValues("username");
	const [usernames, setUsernames] = useState<string[]>([]);

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		register("fee", common.fee(wallet.balance(), wallet.network()));
	}, [register, unregister, common, fees, wallet]);

	useEffect(() => {
		setUsernames(
			env
				.delegates()
				.all(wallet.coinId(), wallet.networkId())
				.map((delegate: ReadOnlyWallet) => delegate.username()!),
		);
	}, [env, wallet]);

	useEffect(() => {
		if (!username) {
			register("username", delegateRegistration.username(usernames));
		}
	}, [delegateRegistration, usernames, register, username, t]);

	return (
		<section data-testid="DelegateRegistrationForm__form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			/>

			<Alert>{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.WARNING")}</Alert>

			<TransactionSender
				address={wallet.address()}
				alias={wallet.alias()}
				borderPosition="bottom"
				paddingPosition="bottom"
			/>

			<div className="space-y-8">
				<FormField name="username">
					<FormLabel label={t("TRANSACTION.DELEGATE_NAME")} />
					<InputDefault
						data-testid="Input__username"
						defaultValue={username}
						onChange={(event: any) =>
							setValue("username", event.target.value, { shouldValidate: true, shouldDirty: true })
						}
					/>
				</FormField>

				<FormField name="fee">
					<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
					<InputFee
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						defaultValue={fee}
						value={fee}
						step={step}
						showFeeOptions={wallet.network().can(FeatureFlag.MiscellaneousDynamicFees)}
						onChange={(currency) => {
							setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true });
						}}
					/>
				</FormField>
			</div>
		</section>
	);
};
