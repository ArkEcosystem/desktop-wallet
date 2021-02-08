import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useValidation } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail, TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ fees, senderWallet }: { senderWallet: ReadWriteWallet; fees: Contracts.TransactionFee }) => {
	const { t } = useTranslation();
	const { getValues, register, setValue, watch } = useFormContext();

	const { common } = useValidation();

	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		register(
			"fee",
			common.fee(() => fees, senderWallet.balance(), senderWallet.network()),
		);
	}, [register, common, fees, senderWallet]);

	return (
		<section data-testid="SendDelegateResignation__form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE")}
				subtitle={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.DESCRIPTION")}
			/>

			<Alert>{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.WARNING")}</Alert>

			<div>
				<TransactionSender
					address={senderWallet.address()}
					alias={senderWallet.alias()}
					border={false}
					paddingPosition="bottom"
				/>

				<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")} borderPosition="both">
					{senderWallet.username()}
				</TransactionDetail>
			</div>

			<FormField name="fee">
				<FormLabel>{t("TRANSACTION.TRANSACTION_FEE")}</FormLabel>
				<InputFee
					min={fees.min}
					avg={fees.avg}
					max={fees.max}
					value={fee}
					step={0.01}
					onChange={(currency) =>
						setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true })
					}
				/>
				<FormHelperText />
			</FormField>
		</section>
	);
};
