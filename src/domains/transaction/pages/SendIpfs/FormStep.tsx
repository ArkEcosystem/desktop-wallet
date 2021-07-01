import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { useFees } from "app/hooks";
import { InputFee } from "domains/transaction/components/InputFee";
import { TransactionNetwork, TransactionSender } from "domains/transaction/components/TransactionDetail";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FormStep = ({
	profile,
	wallet,
}: {
	profile: Contracts.IProfile;
	wallet: Contracts.IReadWriteWallet;
}) => {
	const { t } = useTranslation();

	const { findByType } = useFees(profile);

	const { getValues, setValue, watch } = useFormContext();
	const { hash, fee, fees } = watch();

	const inputFeeSettings = watch("inputFeeSettings") ?? {};

	useEffect(() => {
		const setTransactionFees = async (wallet: Contracts.IReadWriteWallet) => {
			const transactionFees = await findByType(wallet.coinId(), wallet.networkId(), "ipfs");
			setValue("fees", transactionFees);

			if (!getValues("fee")) {
				setValue("fee", transactionFees.avg !== 0 ? transactionFees.avg : transactionFees.static, {
					shouldDirty: true,
					shouldValidate: true,
				});
			}
		};

		setTransactionFees(wallet);
	}, [findByType, getValues, wallet, setValue]);

	return (
		<section data-testid="SendIpfs__form-step">
			<Header
				title={t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}
			/>

			<TransactionNetwork network={wallet.network()} border={false} />

			<TransactionSender address={wallet.address()} alias={wallet.alias()} borderPosition="both" />

			<div className="pt-6 space-y-6">
				<FormField name="hash">
					<FormLabel label={t("TRANSACTION.IPFS_HASH")} />
					<InputDefault
						data-testid="Input__hash"
						type="text"
						placeholder=" "
						defaultValue={hash}
						onChange={(event: any) =>
							setValue("hash", event.target.value, {
								shouldDirty: true,
								shouldValidate: true,
							})
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
						step={0.01}
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

export { FormStep };
