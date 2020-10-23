import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
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

	const { delegateRegistration } = useValidation();

	const { getValues, register, setValue, watch } = useFormContext();
	const username = getValues("username");
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		setDelegates(env.delegates().all(wallet.coinId(), wallet.networkId()));
	}, [env, wallet]);

	useEffect(() => {
		if (!username) {
			register("username", {
				...delegateRegistration.username(),
				validate: (value) =>
					!delegates.some((delegate: ReadOnlyWallet) => delegate.username() === value) ||
					t("COMMON.VALIDATION.EXISTS", { field: t("COMMON.DELEGATE_NAME") }).toString(),
			});
		}
	}, [delegateRegistration, delegates, register, username, t]);

	return (
		<section data-testid="DelegateRegistrationForm__step--second" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.DESCRIPTION")}
			/>

			<Alert size="lg">{t("TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.WARNING")}</Alert>

			<TransactionSender
				address={wallet.address()}
				wallet={wallet}
				labelExtra={t("TRANSACTION.YOUR_ADDRESS")}
				borderPosition="bottom"
				paddingPosition="bottom"
			/>

			<div className="space-y-8">
				<FormField name="username">
					<FormLabel label={t("TRANSACTION.DELEGATE_NAME")} />
					<Input
						data-testid="Input__username"
						className="pr-20"
						defaultValue={username}
						onChange={(event: any) =>
							setValue("username", event.target.value, { shouldValidate: true, shouldDirty: true })
						}
					/>
					<FormHelperText />
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
						onChange={(currency) => {
							setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true });
						}}
					/>
				</FormField>
			</div>
		</section>
	);
};
