import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const NetworkStep = ({ profile, networks }: { profile: Contracts.IProfile; networks: Coins.Network[] }) => {
	const { getValues, setValue } = useFormContext();

	const availableNetworks = useMemo(() => {
		const usesTestNetworks = profile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
		return usesTestNetworks ? networks : networks.filter((network) => network.isLive());
	}, [profile, networks]);

	const selectedNetwork: Coins.Network = getValues("network");

	const { t } = useTranslation();

	const handleSelect = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<section data-testid="SendTransfer__network-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_TRANSACTION_SEND.NETWORK_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_TRANSACTION_SEND.NETWORK_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="SendTransfer__network-step__select"
					networks={availableNetworks}
					selected={selectedNetwork}
					onSelect={handleSelect}
				/>
			</FormField>
		</section>
	);
};
