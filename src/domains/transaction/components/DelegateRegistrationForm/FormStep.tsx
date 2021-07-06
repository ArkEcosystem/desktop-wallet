import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { useValidation } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionNetwork, TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ fees, wallet, step = 0.001, profile }: any) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const { delegateRegistration, common } = useValidation();

	const { getValues, register, unregister, setValue, watch } = useFormContext();
	const username = getValues("username");
	const [usernames, setUsernames] = useState<string[]>([]);

	const inputFeeSettings = getValues("inputFeeSettings") ?? {};

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
				.map((delegate: Contracts.IReadOnlyWallet) => delegate.username()!),
		);
	}, [env, wallet]);

	useEffect(() => {
		if (!username) {
			register("username", delegateRegistration.username(usernames));
		}
	}, [delegateRegistration, usernames, register, username, t]);

	return (
		<section data-testid="DelegateRegistrationForm__form-step">
			<Header
				title={t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.FORM_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.FORM_STEP.DESCRIPTION")}
			/>

			<Alert className="mt-6">{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.FORM_STEP.WARNING")}</Alert>

			<TransactionNetwork network={wallet.network()} border={false} />

			<TransactionSender address={wallet.address()} alias={wallet.alias()} borderPosition="both" />

			<div className="pt-6 space-y-6">
				<FormField name="username">
					<FormLabel label={t("TRANSACTION.DELEGATE_NAME")} />
					<InputDefault
						data-testid="Input__username"
						defaultValue={username}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setValue("username", event.target.value, { shouldDirty: true, shouldValidate: true })
						}
					/>
				</FormField>

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
							setValue("fee", value, { shouldDirty: true, shouldValidate: true });
						}}
						viewType={inputFeeSettings.viewType}
						onChangeViewType={(viewType) => {
							setValue(
								"inputFeeSettings",
								{ ...inputFeeSettings, viewType },
								{ shouldDirty: true, shouldValidate: true },
							);
						}}
						simpleValue={inputFeeSettings.simpleValue}
						onChangeSimpleValue={(simpleValue) => {
							setValue(
								"inputFeeSettings",
								{ ...inputFeeSettings, simpleValue },
								{ shouldDirty: true, shouldValidate: true },
							);
						}}
					/>
				</FormField>
			</div>
		</section>
	);
};
