import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { getNetworkExtendedData } from "domains/network/helpers";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ThirdStep = ({ address, nameMaxLength }: { address: string; nameMaxLength: number }) => {
	const { getValues, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: NetworkData = getValues("network") || defaultNetwork;

	const networkConfig = getNetworkExtendedData({ coin: network.coin(), network: network.id() });

	const { t } = useTranslation();

	return (
		<section data-testid="ImportWallet__third-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<div>
				<TransactionDetail
					className="pt-0"
					label={t("COMMON.NETWORK")}
					borderPosition="bottom"
					extra={<NetworkIcon size="lg" coin={network.coin()} network={network.id()} />}
				>
					{networkConfig?.displayName}
				</TransactionDetail>

				<TransactionDetail
					label={t("COMMON.ADDRESS")}
					borderPosition="bottom"
					extra={<Avatar size="lg" address={address} />}
				>
					<Address address={address} maxChars={0} />
				</TransactionDetail>
			</div>

			<FormField name="name">
				<FormLabel label={t("WALLETS.PAGE_IMPORT_WALLET.WALLET_NAME")} required={false} optional />
				<Input
					ref={register({
						maxLength: {
							value: nameMaxLength,
							message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
								maxLength: nameMaxLength,
							}),
						},
					})}
					data-testid="ImportWallet__name-input"
				/>
				<FormHelperText />
			</FormField>
		</section>
	);
};
