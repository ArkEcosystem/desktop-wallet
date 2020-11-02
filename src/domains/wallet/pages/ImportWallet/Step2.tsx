import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
// @ts-ignore
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputAddress, InputPassword } from "app/components/Input";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = ({ profile }: { profile: Profile }) => {
	const { env } = useEnvironmentContext();
	const { getValues, register, unregister, watch } = useFormContext();
	const [isAddressOnly, setIsAddressOnly] = useState(false);

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: Coins.Network = getValues("network") || defaultNetwork;

	const { t } = useTranslation();

	const renderImportInput = () => {
		if (!isAddressOnly) {
			return (
				<FormField name="passphrase">
					<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.YOUR_PASSPHRASE"),
							}).toString(),
							validate: async (passphrase) => {
								const instance: Coins.Coin = await env.coin(network.coin(), network.id());
								const address = await instance.identity().address().fromMnemonic(passphrase);

								return (
									!profile.wallets().findByAddress(address) ||
									t("COMMON.INPUT_PASSPHRASE.VALIDATION.ADDRESS_ALREADY_EXISTS", {
										address,
									}).toString()
								);
							},
						})}
						data-testid="ImportWallet__passphrase-input"
					/>
					<FormHelperText />
				</FormField>
			);
		}

		return (
			<FormField name="address">
				<FormLabel label={t("COMMON.ADDRESS")} />
				<InputAddress
					coin={network.coin()}
					network={network.id()}
					registerRef={register}
					additionalRules={{
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.ADDRESS"),
						}).toString(),
						validate: {
							duplicateAddress: (address) =>
								!profile.wallets().findByAddress(address) ||
								t("COMMON.INPUT_ADDRESS.VALIDATION.ADDRESS_ALREADY_EXISTS", { address }).toString(),
						},
					}}
					data-testid="ImportWallet__address-input"
				/>
				<FormHelperText />
			</FormField>
		);
	};

	return (
		<section data-testid="ImportWallet__second-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.SUBTITLE")}
			/>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold text-theme-secondary-text">
						{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.ADDRESS_ONLY.TITLE")}
					</div>

					<Toggle
						name="isAddressOnly"
						checked={isAddressOnly}
						onChange={() => {
							unregister("passphrase");
							setIsAddressOnly(!isAddressOnly);
						}}
						data-testid="ImportWallet__address-toggle"
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.ADDRESS_ONLY.DESCRIPTION")}
				</div>
			</div>

			<div data-testid="ImportWallet__fields">{renderImportInput()}</div>
		</section>
	);
};
