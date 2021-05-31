import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputAddress, InputPassword } from "app/components/Input";
import { Select } from "app/components/SelectDropdown";
import { useActiveProfile } from "app/hooks";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MnemonicField = ({
	network,
	profile,
	label,
	findAddress,
	...props
}: {
	profile: Contracts.IProfile;
	network: Coins.Network;
	label: string;
	findAddress: (value: string) => Promise<string>;
} & Omit<React.HTMLProps<any>, "ref">) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<FormField name="value">
			<FormLabel label={label} />
			<InputPassword
				ref={register({
					required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: label,
					}).toString(),
					validate: async (value) => {
						try {
							const address = await findAddress(value);

							return (
								!profile.wallets().findByAddress(address) ||
								t("COMMON.INPUT_PASSPHRASE.VALIDATION.ADDRESS_ALREADY_EXISTS", {
									address,
								}).toString()
							);
						} catch (e) {
							return e.message;
						}
					},
				})}
				{...props}
			/>
		</FormField>
	);
};

const AddressField = ({ network, profile }: { profile: Contracts.IProfile; network: Coins.Network }) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<FormField name="value">
			<FormLabel label={t("COMMON.ADDRESS")} />
			<InputAddress
				profile={profile}
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

const ImportInputField = ({
	type,
	network,
	profile,
}: {
	type: string;
	network: Coins.Network;
	profile: Contracts.IProfile;
}) => {
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();
	const [coin] = useState(() => activeProfile.coins().set(network.coin(), network.id()));
	const { register } = useFormContext();

	if (type === "mnemonic") {
		return (
			<MnemonicField
				network={network}
				profile={profile}
				label={t("COMMON.MNEMONIC")}
				data-testid="ImportWallet__mnemonic-input"
				findAddress={async (value) => {
					await coin.__construct();
					const { address } = await coin.identity().address().fromMnemonic(value);
					return address;
				}}
			/>
		);
	}

	if (type === "address") {
		return <AddressField network={network} profile={profile} />;
	}

	if (type === "privateKey") {
		return (
			<MnemonicField
				network={network}
				profile={profile}
				label={t("COMMON.PRIVATE_KEY")}
				data-testid="ImportWallet__privatekey-input"
				findAddress={async (value) => {
					try {
						await coin.__construct();
						const { address } = await coin.identity().address().fromPrivateKey(value);
						return address;
					} catch {
						throw new Error(t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.INVALID_PRIVATE_KEY"));
					}
				}}
			/>
		);
	}

	if (type === "wif") {
		return (
			<MnemonicField
				network={network}
				profile={profile}
				label={t("COMMON.WIF")}
				data-testid="ImportWallet__wif-input"
				findAddress={async (value) => {
					try {
						await coin.__construct();
						const { address } = await coin.identity().address().fromWIF(value);
						return address;
					} catch (e) {
						throw new Error(t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.INVALID_WIF"));
					}
				}}
			/>
		);
	}

	if (type === "encryptedWif") {
		return (
			<>
				<FormField name="encryptedWif">
					<FormLabel label={t("COMMON.ENCRYPTED_WIF")} />
					<div className="relative">
						<Input
							ref={register({
								required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
									field: t("COMMON.ENCRYPTED_WIF"),
								}).toString(),
							})}
							data-testid="ImportWallet__encryptedWif-input"
						/>
					</div>
				</FormField>

				<MnemonicField
					network={network}
					profile={profile}
					label={t("COMMON.PASSWORD")}
					data-testid="ImportWallet__encryptedWif__password-input"
					findAddress={(value) => Promise.resolve(value)}
				/>
			</>
		);
	}

	return null;
};

export const SecondStep = ({ profile }: { profile: Contracts.IProfile }) => {
	const { t } = useTranslation();
	const { getValues, watch, setValue, clearErrors } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [defaultNetwork] = useState(() => watch("network"));
	const network: Coins.Network = getValues("network") || defaultNetwork;

	const allOptions = useMemo(
		() => [
			{ label: t("COMMON.MNEMONIC"), value: "mnemonic" },
			{ label: t("COMMON.ADDRESS"), value: "address" },
			{ label: t("COMMON.PRIVATE_KEY"), value: "privateKey" },
			{ label: t("COMMON.WIF"), value: "wif" },
			{ label: t("COMMON.ENCRYPTED_WIF"), value: "encryptedWif" },
		],
		[t],
	);

	const options = useMemo(() => {
		const coinOptions = Object.keys(network.importMethods());

		return allOptions.filter((option) => coinOptions.includes(option.value));
	}, [network, allOptions]);

	const type = watch("type", options[0].value);

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
