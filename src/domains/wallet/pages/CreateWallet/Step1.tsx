import { Environment, NetworkData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const { getValues, setValue } = useFormContext();
	const [isGeneratingWallet, setIsGeneratingWallet] = React.useState(false);
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const selectedNetwork: NetworkData = getValues("network");

	const { t } = useTranslation();

	const handleSelect = async (network?: NetworkData | null) => {
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

		setIsGeneratingWallet(true);
		const { mnemonic, wallet } = await profile.wallets().generate(network.coin(), network.id());
		setValue("wallet", wallet, { shouldValidate: true, shouldDirty: true });
		setValue("mnemonic", mnemonic, { shouldValidate: true, shouldDirty: true });
		setIsGeneratingWallet(false);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.NETWORK")} />
				<SelectNetwork
					id="CreateWallet__network"
					networks={networks}
					selected={selectedNetwork}
					onSelect={handleSelect}
					disabled={isGeneratingWallet}
				/>
			</FormField>
		</section>
	);
};
