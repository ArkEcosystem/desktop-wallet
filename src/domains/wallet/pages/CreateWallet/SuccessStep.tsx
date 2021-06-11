import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { TransactionDetail, TransactionNetwork } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SuccessStep = ({ nameMaxLength, profile }: { nameMaxLength: number; profile: Contracts.IProfile }) => {
	const { getValues, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: Networks.Network = getValues("network") || defaultNetwork;

	const [defaultWallet] = useState(() => watch("wallet"));
	const wallet: Contracts.IReadWriteWallet = getValues("wallet") || defaultWallet;

	const { t } = useTranslation();

	return (
		<section data-testid="CreateWallet__SuccessStep" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<div>
				<TransactionNetwork network={network} borderPosition="bottom" paddingPosition="bottom" />

				<TransactionDetail
					label={t("COMMON.ADDRESS")}
					borderPosition="bottom"
					extra={<Avatar size="lg" address={wallet.address()} />}
				>
					<Address address={wallet.address()} />
				</TransactionDetail>
			</div>

			<FormField name="name">
				<FormLabel label={t("WALLETS.WALLET_NAME")} optional />
				<InputDefault
					data-testid="CreateWallet__wallet-name"
					ref={register({
						maxLength: {
							value: nameMaxLength,
							message: t("WALLETS.PAGE_CREATE_WALLET.VALIDATION.MAXLENGTH_ERROR", {
								maxLength: nameMaxLength,
							}),
						},
						validate: {
							duplicateAlias: (alias) =>
								!alias ||
								!profile.wallets().findByAlias(alias.trim()) ||
								t("WALLETS.PAGE_CREATE_WALLET.VALIDATION.ALIAS_EXISTS", {
									alias: alias.trim(),
								}).toString(),
						},
					})}
				/>
			</FormField>
		</section>
	);
};
