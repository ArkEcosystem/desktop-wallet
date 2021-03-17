import { Coins } from "@arkecosystem/platform-sdk";
import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { ValidationRules } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "./Input";

export type InputAddressProps = {
	coin?: string;
	network?: string;
	registerRef?: (options: ValidationRules) => (ref: HTMLInputElement | null) => void;
	additionalRules?: ValidationRules;
	onValidAddress?: (address: string) => void;
	onQRCodeClick?: () => void;
	onChange?: (address: string) => void;
	useDefaultRules?: boolean;
} & React.InputHTMLAttributes<any>;

export const InputAddress = ({
	coin,
	network,
	registerRef,
	additionalRules,
	onValidAddress,
	onQRCodeClick,
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

	return (
		<Input
			ref={registerRef?.(rules)}
			type="text"
			data-testid="InputAddress__input"
			{...props}
			addons={{
				end: (
					<button
						data-testid="InputAddress__qr-button"
						type="button"
						className="flex justify-center items-center w-full h-full text-2xl focus:outline-none"
						onClick={onQRCodeClick}
					>
						<Icon name="QrCode" width={20} height={20} />
					</button>
				),
			}}
		/>
	);
};

InputAddress.defaultProps = {
	additionalRules: {},
	useDefaultRules: true,
};
