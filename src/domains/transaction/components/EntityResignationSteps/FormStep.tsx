import { Alert } from "app/components/Alert";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail, TransactionSender } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EntityResignationStepProps } from "./EntityResignationSteps.models";

export const FormStep = ({ entity, fees }: EntityResignationStepProps) => {
	const { t } = useTranslation();
	const { setValue, watch } = useFormContext();
	const { fee } = watch();

	return (
		<div data-testid="SendEntityResignation__form-step" className="space-y-8">
			<Header
				title={t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.TITLE`)}
				subtitle={t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.DESCRIPTION`)}
			/>

			<Alert size="lg">{t(`TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.WARNING`)}</Alert>

			<div>
				<TransactionSender
					address={entity.wallet().address()}
					alias={entity.wallet().alias()}
					border={false}
					paddingPosition="bottom"
				/>

				<TransactionDetail label={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.ENTITY_NAME")} borderPosition="both">
					{entity.name()}
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
					<FormHelperText />
				</FormField>
			</div>
		</div>
	);
};
