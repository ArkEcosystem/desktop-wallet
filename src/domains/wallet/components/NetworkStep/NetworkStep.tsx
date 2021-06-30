import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useEnvironmentContext } from "app/contexts";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface NetworkStepProperties {
	profile: Contracts.IProfile;
	title: string;
	subtitle: string;
	disabled?: boolean;
	error?: string;
}

export const NetworkStep = ({ profile, title, subtitle, disabled, error }: NetworkStepProperties) => {
	const { getValues, setValue, setError, clearErrors } = useFormContext();
	const { env } = useEnvironmentContext();

	const networks = useMemo(() => {
		const usesTestNetworks = profile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
		const availableNetworks = env.availableNetworks();

		if (!usesTestNetworks) {
			return availableNetworks.filter((item) => item.isLive());
		}

		return availableNetworks;
	}, [env, profile]);

	const selectedNetwork: Networks.Network = getValues("network");

	const { t } = useTranslation();

	const handleSelect = (network?: Networks.Network | null) => {
		setValue("network", network, { shouldDirty: true, shouldValidate: true });
	};

	const handleInputChange = (value?: string, suggestion?: string) => {
		if (suggestion) {
			clearErrors("network");
		}

		if (!value) {
			return setError("network", {
				message: t("COMMON.VALIDATION.FIELD_REQUIRED", {
					field: t("COMMON.CRYPTOASSET"),
				}),
				type: "manual",
			});
		}

		if (!suggestion) {
			return setError("network", {
				message: t("COMMON.INPUT_NETWORK.VALIDATION.NETWORK_NOT_FOUND"),
				type: "manual",
			});
		}
	};

	return (
		<section data-testid="NetworkStep">
			<Header title={title} subtitle={subtitle} />

			{!!error && (
				<div className="mt-6 -mb-2">
					<Alert variant="danger">{error}</Alert>
				</div>
			)}

			<FormField name="network" className="flex flex-col mt-8 space-y-2">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="NetworkStep__network"
					disabled={disabled}
					networks={networks}
					selected={selectedNetwork}
					onInputChange={handleInputChange}
					onSelect={handleSelect}
				/>
			</FormField>
		</section>
	);
};
