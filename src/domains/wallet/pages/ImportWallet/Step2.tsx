import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
// @ts-ignore
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputAddress, InputPassword } from "app/components/Input";
import { Select } from "app/components/SelectDropdown";
import { useEnvironmentContext } from "app/contexts";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MnemonicField = ({ network, profile }: { profile: Profile; network: Coins.Network }) => {
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<FormField name="value">
			<FormLabel label={t("COMMON.MNEMONIC")} />
			<InputPassword
				ref={register({
					required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.MNEMONIC"),
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
				data-testid="ImportWallet__mnemonic-input"
			/>
		</FormField>
	);
};

const AddressField = ({ network, profile }: { profile: Profile; network: Coins.Network }) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<FormField name="value">
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
		</FormField>
	);
};

const ImportInputField = ({ type, network, profile }: { type: string; network: Coins.Network; profile: Profile }) => {
	if (type === "mnemonic") {
		return <MnemonicField network={network} profile={profile} />;
	}

	if (type === "address") {
		return <AddressField network={network} profile={profile} />;
	}

	return null;
};

export const SecondStep = ({ profile }: { profile: Profile }) => {
	const { t } = useTranslation();
	const { getValues, watch, setValue, clearErrors } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: Coins.Network = getValues("network") || defaultNetwork;

	const options = useMemo(
		() => [
			{ label: t("COMMON.MNEMONIC"), value: "mnemonic" },
			{ label: t("COMMON.ADDRESS"), value: "address" },
		],
		[t],
	);

	const type = watch("type", "mnemonic");

	return (
		<section data-testid="ImportWallet__second-step" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.SUBTITLE")}
			/>

			<div className="flex flex-col space-y-4">
				<FormField name="">
					<FormLabel>{t("WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TYPE")}</FormLabel>
					<Select
						id="ImportWallet__select"
						data-testid="ImportWallet__type"
						defaultValue={type}
						options={options}
						onChange={(option: any) => {
							setValue("type", option.value, { shouldDirty: true, shouldValidate: true });
							setValue("value", undefined);
							clearErrors("value");
						}}
					/>
				</FormField>

				<ImportInputField type={type} network={network} profile={profile} />
			</div>
		</section>
	);
};
