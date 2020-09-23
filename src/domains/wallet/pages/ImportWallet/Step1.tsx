import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { useEnvironmentContext } from "app/contexts";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = () => {
	const { getValues, register, setValue } = useFormContext();
	const { env } = useEnvironmentContext();
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const selectedNetwork: NetworkData = getValues("network");

	const { t } = useTranslation();

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelect = (network?: NetworkData | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
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
