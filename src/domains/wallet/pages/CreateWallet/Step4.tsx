import { NetworkData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
import { TransactionDetail } from "app/components/TransactionDetail";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FourthStep = ({ nameMaxLength }: { nameMaxLength: number }) => {
	const { getValues, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: NetworkData = getValues("network") || defaultNetwork;

	const [defaultWallet] = useState(() => watch("wallet"));
	const wallet: ReadWriteWallet = getValues("wallet") || defaultWallet;

	const networkConfig = getNetworkExtendedData({ coin: network.coin(), network: network.id() });

	const { t } = useTranslation();

	return (
		<section data-testid="CreateWallet__fourth-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
				/>
			</div>

			<TransactionDetail
				label={t("COMMON.NETWORK")}
				borderPosition="bottom"
				extra={<NetworkIcon size="lg" coin={network.coin()} network={network.id()} />}
			>
				{networkConfig?.displayName}
			</TransactionDetail>

			<TransactionDetail
				label={t("COMMON.ADDRESS")}
				borderPosition="bottom"
				extra={<Avatar size="lg" address={wallet.address()} />}
			>
				<Address address={wallet.address()} maxChars={0} />
			</TransactionDetail>

			<FormField name="name" className="mt-8">
				<FormLabel label={t("WALLETS.PAGE_CREATE_WALLET.WALLET_NAME")} required={false} optional />
				<Input
					data-testid="CreateWallet__wallet-name"
					ref={register({
						maxLength: {
							value: nameMaxLength,
							message: t("WALLETS.PAGE_CREATE_WALLET.VALIDATION.MAXLENGTH_ERROR", {
								maxLength: nameMaxLength,
							}),
						},
					})}
				/>
				<FormHelperText />
			</FormField>
		</section>
	);
};
