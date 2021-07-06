import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const NetworkStep = ({ profile, networks }: { profile: Contracts.IProfile; networks: Networks.Network[] }) => {
	const { getValues, setValue, setError, clearErrors } = useFormContext();

	const availableNetworks = useMemo(() => {
		const usesTestNetworks = profile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
		return usesTestNetworks ? networks : networks.filter((network) => network.isLive());
	}, [profile, networks]);

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
		<section data-testid="SendTransfer__network-step" className="space-y-6">
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
					onInputChange={handleInputChange}
					onSelect={handleSelect}
				/>
			</FormField>
		</section>
	);
};
