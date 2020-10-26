import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail, TransactionSender } from "domains/transaction/components/TransactionDetail";
import { StepProps } from "domains/transaction/pages/SendEntityResignation/SendEntityResignation.models";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ fees, senderWallet }: StepProps) => {
	const { t } = useTranslation();
	const { setValue, watch } = useFormContext();
	const { fee } = watch();

	return (
		<section data-testid="SendDelegateResignation__form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE")}
				subtitle={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.DESCRIPTION")}
			/>

			<Alert size="lg">{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.WARNING")}</Alert>

			<div>
				<TransactionSender
					address={senderWallet.address()}
					wallet={senderWallet}
					labelExtra={t("TRANSACTION.YOUR_ADDRESS")}
					border={false}
					paddingPosition="bottom"
				/>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")} borderPosition="both">
					{senderWallet.username()}
				</TransactionDetail>
			</div>

			<div className="space-y-8">
				<FormField name="fee" className="font-normal">
					<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
					<InputFee
						value={fee}
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						step={0.01}
						onChange={(currency) =>
							setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true })
						}
					/>
				</FormField>
			</div>
		</section>
	);
};
