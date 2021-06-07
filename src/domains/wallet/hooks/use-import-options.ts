import { NetworkManifestImportMethods } from "@arkecosystem/platform-sdk/dist/networks";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const convertMethodName = (methodName: string) => {
	if (methodName === "bip38") {
		return "encryptedWif";
	}

	if (methodName.startsWith("bip")) {
		return `mnemonic.${methodName}`;
	}

	return methodName;
};

interface Network {
	options: string[];
	defaultOption?: string;
}

export const useImportOptions = (methods: NetworkManifestImportMethods) => {
	const { t } = useTranslation();

	const allOptions = useMemo(
		() => [
			{ label: t("COMMON.MNEMONIC_TYPE.BIP39"), value: "mnemonic.bip39" },
			{ label: t("COMMON.MNEMONIC_TYPE.BIP44"), value: "mnemonic.bip44" },
			{ label: t("COMMON.MNEMONIC_TYPE.BIP49"), value: "mnemonic.bip49" },
			{ label: t("COMMON.MNEMONIC_TYPE.BIP84"), value: "mnemonic.bip84" },
			{ label: t("COMMON.ADDRESS"), value: "address" },
			{ label: t("COMMON.PRIVATE_KEY"), value: "privateKey" },
			{ label: t("COMMON.WIF"), value: "wif" },
			{ label: t("COMMON.ENCRYPTED_WIF"), value: "encryptedWif" },
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
					options: [],
					defaultOption: undefined,
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

		return { options, defaultOption };
	}, [allOptions, network]);
};
