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

export const FirstStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const context = useEnvironmentContext();
	const networks = useMemo(() => context.env.availableNetworks(), [context]);

	const selectedNetwork: NetworkData = getValues("network");

	const { t } = useTranslation();

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network?: NetworkData | null) => {
		setValue("network", network, true);
	};

	return (
		<section className="space-y-8" data-testid="ImportWallet__first-step">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE")}
				/>
			</div>
			<div className="space-y-2">
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label={t("COMMON.NETWORK")} />
					</div>
					<SelectNetwork
						id="ImportWallet__network"
						networks={networks}
						selected={selectedNetwork}
						onSelect={handleSelect}
					/>
				</FormField>
			</div>
		</section>
	);
};
