import { Coins } from "@arkecosystem/platform-sdk";
import { Environment, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const { getValues, register, setValue } = useFormContext();

	useEffect(() => {
		register("isGeneratingWallet");
	}, [register]);

	const networks = useMemo(() => {
		const usesTestNetworks = profile.settings().get(ProfileSetting.UseTestNetworks);
		const availableNetworks = env.availableNetworks();

		if (!usesTestNetworks) {
			return availableNetworks.filter((item) => item.isLive());
		}

		return availableNetworks;
	}, [env, profile]);

	const selectedNetwork: Coins.Network = getValues("network");

	const { t } = useTranslation();

	const handleSelect = async (network?: Coins.Network | null) => {
		const currentWallet = getValues("wallet");

		setValue("network", network, { shouldValidate: true, shouldDirty: true });
		setValue("wallet", null, { shouldValidate: true, shouldDirty: true });
		setValue("mnemonic", null, { shouldValidate: true, shouldDirty: true });

		if (currentWallet) {
			profile.wallets().forget(currentWallet.id());
		}

		if (!network) {
			return;
		}

		setValue("isGeneratingWallet", true);

		const { mnemonic, wallet } = await profile.wallets().generate(network.coin(), network.id());
		setValue("wallet", wallet, { shouldValidate: true, shouldDirty: true });
		setValue("mnemonic", mnemonic, { shouldValidate: true, shouldDirty: true });

		setValue("isGeneratingWallet", false);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="CreateWallet__network"
					networks={networks}
					selected={selectedNetwork}
					onSelect={handleSelect}
					disabled={getValues("isGeneratingWallet")}
				/>
			</FormField>
		</section>
	);
};
