import { Coins } from "@arkecosystem/platform-sdk";
import { NetworkData, Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputAddress, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const ThirdStep = ({ address, nameMaxLength }: { address: string; nameMaxLength: number }) => {
	const { getValues, register } = useFormContext();
	const network: NetworkData = getValues("network");
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
