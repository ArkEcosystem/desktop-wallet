import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useFees } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail, TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ senderWallet }: { senderWallet: ReadWriteWallet }) => {
	const { t } = useTranslation();

	const { getValues, register, setValue, watch } = useFormContext();

	const [fees, setFees] = useState<Contracts.TransactionFee>({
		static: "25",
		max: "0",
		min: "0",
		avg: "0",
	});

	useEffect(() => {
		register("fees");
	}, [register]);

	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	const { findByType } = useFees();

	useEffect(() => {
		const setTransactionFees = async (senderWallet: ReadWriteWallet) => {
			const fees = await findByType(senderWallet.coinId(), senderWallet.networkId(), "delegateResignation");

			setFees(fees);
			setValue("fees", fees);
		};

		setTransactionFees(senderWallet);
	}, [setValue, senderWallet, findByType]);

	useEffect(() => {
		if (fee === undefined) {
			setValue("fee", fees.avg !== "0" ? fees.avg : fees.static, { shouldValidate: true, shouldDirty: true });
		}
	}, [fee, fees, setValue]);

	return (
		<section data-testid="SendDelegateResignation__form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FORM_STEP.DELEGATE.TITLE")}
				subtitle={t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FORM_STEP.DELEGATE.DESCRIPTION")}
			/>

			<Alert>{t("TRANSACTION.PAGE_RESIGN_REGISTRATION.FORM_STEP.DELEGATE.WARNING")}</Alert>

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
					showFeeOptions={senderWallet.network().can(Coins.FeatureFlag.MiscellaneousDynamicFees)}
					onChange={(currency) =>
						setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true })
					}
				/>
			</FormField>
		</section>
	);
};
