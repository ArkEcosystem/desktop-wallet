import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useEnvironmentContext } from "app/contexts";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type NetworkStepProps = {
	profile: Contracts.IProfile;
	title: string;
	subtitle: string;
	disabled?: boolean;
	error?: string;
};

export const NetworkStep = ({ profile, title, subtitle, disabled, error }: NetworkStepProps) => {
	const { getValues, register, setValue } = useFormContext();
	const { env } = useEnvironmentContext();

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

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<section data-testid="NetworkStep">
			<Header title={title} subtitle={subtitle} />

			{!!error && (
				<div className="mt-6 -mb-2">
					<Alert variant="danger">{error}</Alert>
				</div>
			)}

			<FormField name="network" className="flex flex-col space-y-2 mt-8">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="NetworkStep__network"
					disabled={disabled}
					networks={networks}
					selected={selectedNetwork}
					onSelect={handleSelect}
				/>
			</FormField>
		</section>
	);
};
