import { Contracts } from "@arkecosystem/platform-sdk";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Label } from "app/components/Label";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputFee } from "../InputFee";

export const GenerationStep = ({ fees, wallet }: { fees: Contracts.TransactionFee; wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();

	const { getValues, setValue, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		register("secondMnemonic");
		register("wallet");
	}, [register]);

	useEffect(() => {
		const newMnemonic = BIP39.generate();
		setValue("secondMnemonic", newMnemonic);
		setValue("wallet", wallet);
	}, [setValue, wallet]);

	return (
		<section data-testid="SecondSignatureRegistrationForm__generation-step">
			<div className="my-8">
				<Header
					title={t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.TITLE")}
					subtitle={t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.DESCRIPTION")}
				/>
			</div>

			<div className="mt-4">
				<Alert size="lg">{t("TRANSACTION.PAGE_SECOND_SIGNATURE.GENERATION_STEP.WARNING")}</Alert>

				<TransactionDetail
					className="mt-2"
					extra={<Avatar size="lg" address={wallet.address()} />}
					borderPosition="bottom"
				>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<FormField name="fee" className="mt-8">
					<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
					<InputFee
						min={fees.min}
						avg={fees.avg}
						max={fees.max}
						defaultValue={fee || 0}
						value={fee || 0}
						step={0.01}
						onChange={(currency: { display: string; value: string }) => {
							setValue("fee", currency, { shouldValidate: true, shouldDirty: true });
						}}
					/>
				</FormField>
			</div>
		</section>
	);
};
