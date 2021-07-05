import { Networks } from "@arkecosystem/platform-sdk";
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
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({
	senderWallet,
	profile,
}: {
	senderWallet: ProfilesContracts.IReadWriteWallet;
	profile: ProfilesContracts.IProfile;
}) => {
	const { t } = useTranslation();

	const { findByType } = useFees(profile);

	const { getValues, setValue, watch } = useFormContext();
	const { fee, fees } = watch();

  const inputFeeSettings = watch("inputFeeSettings") ?? {};

	useEffect(() => {
		const setTransactionFees = async (network: Networks.Network) => {
			const fees = await findByType(network.coin(), network.id(), "delegateResignation");

			setValue("fees", fees);

			if (!getValues("fee")) {
				setValue("fee", fees.avg, {
					shouldDirty: true,
					shouldValidate: true,
				});
			}
		};

		setTransactionFees(senderWallet.network());
	}, [findByType, getValues, setValue, senderWallet]);

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
