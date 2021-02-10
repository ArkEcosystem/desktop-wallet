import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault } from "app/components/Input";
import { TransactionDetail, TransactionNetwork } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ThirdStep = ({
	address,
	balance,
	nameMaxLength,
	profile,
}: {
	address: string;
	balance: BigNumber;
	nameMaxLength: number;
	profile: Profile;
}) => {
	const { getValues, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: Coins.Network = getValues("network") || defaultNetwork;

	const { t } = useTranslation();

	return (
		<section data-testid="ImportWallet__third-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<div>
				<TransactionNetwork network={network} borderPosition="bottom" paddingPosition="bottom" />

				<TransactionDetail
					label={t("COMMON.ADDRESS")}
					borderPosition="bottom"
					extra={<Avatar size="lg" address={address} />}
				>
					<Address address={address} maxChars={0} />
				</TransactionDetail>
			</div>

			<TransactionDetail label={t("COMMON.BALANCE")} borderPosition="bottom" paddingPosition="bottom">
				<Amount value={balance} ticker={network.ticker()} />
			</TransactionDetail>

			<FormField name="name">
				<FormLabel label={t("WALLETS.PAGE_IMPORT_WALLET.WALLET_NAME")} required={false} optional />
				<InputDefault
					ref={register({
						maxLength: {
							value: nameMaxLength,
							message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
								maxLength: nameMaxLength,
							}),
						},
						validate: {
							duplicateAlias: (alias) =>
								!alias ||
								!profile.wallets().findByAlias(alias.trim()) ||
								t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_EXISTS", {
									alias: alias.trim(),
								}).toString(),
						},
					})}
					data-testid="ImportWallet__name-input"
				/>
			</FormField>
		</section>
	);
};
