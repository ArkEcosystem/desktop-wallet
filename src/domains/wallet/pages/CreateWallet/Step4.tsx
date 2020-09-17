import { NetworkData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Divider } from "app/components/Divider";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input } from "app/components/Input";
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

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.NETWORK")}</p>
						<p data-testid="CreateWallet__network-name" className="text-lg font-medium">
							{networkConfig?.displayName}
						</p>
					</div>
					<NetworkIcon coin={network.coin()} network={network.id()} />
				</li>
				<li>
					<Divider dashed />
				</li>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.ADDRESS")}</p>
						<p data-testid="CreateWallet__wallet-address" className="text-lg font-medium">
							{wallet.address()}
						</p>
					</div>
					<Avatar address={wallet.address()} />
				</li>
			</ul>

			<Divider dashed />

			<FormField name="name">
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
