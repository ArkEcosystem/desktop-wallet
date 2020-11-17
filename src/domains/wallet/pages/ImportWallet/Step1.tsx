import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useEnvironmentContext } from "app/contexts";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ profile }: { profile: Profile }) => {
	const { getValues, register, setValue } = useFormContext();
	const { env } = useEnvironmentContext();

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

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<section data-testid="ImportWallet__first-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="ImportWallet__network"
					networks={networks}
					selected={selectedNetwork}
					onSelect={handleSelect}
				/>
			</FormField>
		</section>
	);
};
