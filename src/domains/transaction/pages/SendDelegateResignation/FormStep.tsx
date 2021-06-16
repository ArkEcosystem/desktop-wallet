import { Contracts as ProfilesContracts } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useFees } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionDetail, TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TransactionFees } from "types";

export const FormStep = ({
	senderWallet,
	profile,
}: {
	senderWallet: ProfilesContracts.IReadWriteWallet;
	profile: ProfilesContracts.IProfile;
}) => {
	const { t } = useTranslation();

	const { getValues, register, setValue, watch } = useFormContext();

	const [fees, setFees] = useState<TransactionFees>({
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
	const inputFeeSettings = watch("inputFeeSettings") ?? {};

	const { findByType } = useFees(profile);

	useEffect(() => {
		const setTransactionFees = async (senderWallet: ProfilesContracts.IReadWriteWallet) => {
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
				title={t("TRANSACTION.PAGE_DELEGATE_RESIGNATION.FORM_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_DELEGATE_RESIGNATION.FORM_STEP.DESCRIPTION")}
			/>

			<Alert>{t("TRANSACTION.PAGE_DELEGATE_RESIGNATION.FORM_STEP.WARNING")}</Alert>

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
					min={fees?.min}
					avg={fees?.avg}
					max={fees?.max}
					loading={!fees}
					value={fee}
					step={0.01}
					disabled={senderWallet.network().feeType() !== "dynamic"}
					onChange={(value) => setValue("fee", value, { shouldValidate: true, shouldDirty: true })}
					network={senderWallet.network()}
					profile={profile}
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
