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

export const FirstStep = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const { getValues, setValue } = useFormContext();
	const [isGeneratingWallet, setIsGeneratingWallet] = React.useState(false);
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const selectedNetwork: NetworkData = getValues("network");

	const { t } = useTranslation();

	const handleSelect = async (network?: NetworkData | null) => {
		const currentWallet = getValues("wallet");

		setValue("network", network, true);
		setValue("wallet", null, true);
		setValue("mnemonic", null, true);

		if (currentWallet) {
			profile.wallets().forget(currentWallet.id());
		}

		if (!network) {
			return;
		}

		setIsGeneratingWallet(true);
		const { mnemonic, wallet } = await profile.wallets().generate(network.coin(), network.id());
		setValue("wallet", wallet, true);
		setValue("mnemonic", mnemonic, true);
		setIsGeneratingWallet(false);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.SUBTITLE")}
				/>
			</div>
			<div className="space-y-2">
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label={t("COMMON.NETWORK")} />
					</div>
					<SelectNetwork
						id="CreateWallet__network"
						networks={networks}
						selected={selectedNetwork}
						onSelect={handleSelect}
						disabled={isGeneratingWallet}
					/>
				</FormField>
			</div>
		</section>
	);
};
