import { Coins } from "@arkecosystem/platform-sdk";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { RegisterOptions } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "./Input";

export type InputAddressProps = {
	coin?: string;
	network?: string;
	registerRef?: (options: RegisterOptions) => (ref: HTMLInputElement | null) => void;
	additionalRules?: RegisterOptions;
	onValidAddress?: (address: string) => void;
	onChange?: (address: string) => void;
	useDefaultRules?: boolean;
} & React.InputHTMLAttributes<any>;

export const InputAddress = ({
	coin,
	network,
	registerRef,
	additionalRules,
	onValidAddress,
	useDefaultRules,
	...props
}: InputAddressProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const validateAddress = async (address: string) => {
		const instance: Coins.Coin = await env.coin(coin!, network!);
		const isValidAddress: boolean = await instance.identity().address().validate(address);

		if (isValidAddress) {
			onValidAddress?.(address);
			return true;
		}

		return t("COMMON.INPUT_ADDRESS.VALIDATION.NOT_VALID");
	};

	const defaultRules = {
		...additionalRules,
		validate: {
			validateAddress,
			...additionalRules?.validate,
		},
	};
	const rules = useDefaultRules ? defaultRules : {};

	return <Input ref={registerRef?.(rules)} type="text" data-testid="InputAddress__input" {...props} />;
};

InputAddress.defaultProps = {
	additionalRules: {},
	useDefaultRules: true,
};
