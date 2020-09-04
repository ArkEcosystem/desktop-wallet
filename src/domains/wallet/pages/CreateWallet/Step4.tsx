import { Environment, NetworkData, Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";

export const FourthStep = ({ nameMaxLength }: { nameMaxLength: number }) => {
	const { getValues, register } = useFormContext();
	const network: NetworkData = getValues("network");
	const wallet: ReadWriteWallet = getValues("wallet");
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
