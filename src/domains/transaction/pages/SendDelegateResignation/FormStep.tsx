import { Contracts as ProfilesContracts } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useFees } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import {
	TransactionDetail,
	TransactionNetwork,
	TransactionSender,
} from "domains/transaction/components/TransactionDetail";
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
		avg: 0,
		max: 0,
		min: 0,
		static: 25,
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
			setValue("fee", fees.avg !== 0 ? fees.avg : fees.static, { shouldDirty: true, shouldValidate: true });
		}
	}, [fee, fees, setValue]);

	return (
		<section data-testid="SendDelegateResignation__form-step">
			<Header
				title={t("TRANSACTION.PAGE_DELEGATE_RESIGNATION.FORM_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_DELEGATE_RESIGNATION.FORM_STEP.DESCRIPTION")}
			/>

			<Alert className="mt-6">{t("TRANSACTION.PAGE_DELEGATE_RESIGNATION.FORM_STEP.WARNING")}</Alert>

			<TransactionNetwork network={senderWallet.network()} border={false} />

			<TransactionSender address={senderWallet.address()} alias={senderWallet.alias()} />

			<TransactionDetail label={t("TRANSACTION.DELEGATE_NAME")} borderPosition="both">
				{senderWallet.username()}
			</TransactionDetail>

			<div className="pt-6">
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
						onChange={(value) => setValue("fee", value, { shouldDirty: true, shouldValidate: true })}
						network={senderWallet.network()}
						profile={profile}
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
