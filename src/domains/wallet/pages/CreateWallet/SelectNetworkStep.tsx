import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SelectNetworkStep = ({
	env,
	profile,
	isLoading,
	showError,
}: {
	env: Environment;
	profile: Contracts.IProfile;
	isLoading: boolean;
	showError: boolean;
}) => {
	const { getValues, setValue } = useFormContext();

	const networks = useMemo(() => {
		const usesTestNetworks = profile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
		const availableNetworks = env.availableNetworks();

		if (!usesTestNetworks) {
			return availableNetworks.filter((item) => item.isLive());
		}

		return availableNetworks;
	}, [env, profile]);

	const selectedNetwork: Coins.Network = getValues("network");

	const { t } = useTranslation();

	const handleSelect = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<section data-testid="CreateWallet__SelectNetworkStep">
			<Header
				title={t("WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.SUBTITLE")}
			/>

			{showError && (
				<div className="mt-6 -mb-2">
					<Alert variant="danger">{t("WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.GENERATION_ERROR")}</Alert>
				</div>
			)}

			<FormField name="network" className="flex flex-col space-y-2 mt-8">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="CreateWallet__network"
					networks={networks}
					selected={selectedNetwork}
					onSelect={handleSelect}
					disabled={isLoading}
				/>
			</FormField>
		</section>
	);
};
