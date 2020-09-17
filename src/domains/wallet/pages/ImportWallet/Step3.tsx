import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
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

export const ThirdStep = ({ address, nameMaxLength }: { address: string; nameMaxLength: number }) => {
	const { getValues, register, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: NetworkData = getValues("network") || defaultNetwork;

	const networkConfig = getNetworkExtendedData({ coin: network.coin(), network: network.id() });

	const { t } = useTranslation();

	return (
		<section data-testid="ImportWallet__third-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
				/>
			</div>

			<ul>
				<li className="flex justify-between">
					<div>
						<p className="text-sm font-semibold text-theme-neutral-dark">{t("COMMON.NETWORK")}</p>
						<p className="text-lg font-medium" data-testid="ImportWallet__network-name">
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
						<p className="text-lg font-medium" data-testid="ImportWallet__wallet-address">
							{address}
						</p>
					</div>
					<Avatar address={address} />
				</li>
			</ul>

			<Divider dashed />

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
