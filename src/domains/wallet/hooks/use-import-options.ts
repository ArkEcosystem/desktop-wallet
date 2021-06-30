import { Networks } from "@arkecosystem/platform-sdk";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const convertMethodName = (methodName: string) => {
	if (methodName === "bip38") {
		return "encryptedWif";
	}

	return methodName;
};

export enum OptionsValue {
	BIP39 = "bip39",
	BIP44 = "bip44",
	BIP49 = "bip49",
	BIP84 = "bip84",
	ADDRESS = "address",
	PUBLIC_KEY = "publicKey",
	PRIVATE_KEY = "privateKey",
	WIF = "wif",
	ENCRYPTED_WIF = "encryptedWif",
}

interface Network {
	options: string[];
	defaultOption?: string;
}

export const useImportOptions = (methods: Networks.NetworkManifestImportMethods) => {
	const { t } = useTranslation();

	const allOptions = useMemo(
		() => [
			{ label: t("COMMON.MNEMONIC_TYPE.BIP39"), value: OptionsValue.BIP39 },
			{ label: t("COMMON.MNEMONIC_TYPE.BIP44"), value: OptionsValue.BIP44 },
			{ label: t("COMMON.MNEMONIC_TYPE.BIP49"), value: OptionsValue.BIP49 },
			{ label: t("COMMON.MNEMONIC_TYPE.BIP84"), value: OptionsValue.BIP84 },
			{ label: t("COMMON.ADDRESS"), value: OptionsValue.ADDRESS },
			{ label: t("COMMON.PUBLIC_KEY"), value: OptionsValue.PUBLIC_KEY },
			{ label: t("COMMON.PRIVATE_KEY"), value: OptionsValue.PRIVATE_KEY },
			{ label: t("COMMON.WIF"), value: OptionsValue.WIF },
			{ label: t("COMMON.ENCRYPTED_WIF"), value: OptionsValue.ENCRYPTED_WIF },
		],
		[t],
	);

	const network = useMemo(
		() =>
			Object.entries(methods).reduce<Network>(
				(network, [methodName, method]) => {
					const option = convertMethodName(methodName);

					if (method.default) {
						network.defaultOption = option;
					}

					network.options.push(option);

					return network;
				},
				{
					defaultOption: undefined,
					options: [],
				},
			),
		[methods],
	);

	return useMemo(() => {
		let defaultOption: string | undefined;

		const options = allOptions.filter((option) => {
			// check if default option exist in options
			if (network.defaultOption === option.value) {
				defaultOption = network.defaultOption;
			}
			return network.options.includes(option.value);
		});

		if (!defaultOption) {
			defaultOption = options[0].value;
		}

		return { defaultOption, options };
	}, [allOptions, network]);
};
