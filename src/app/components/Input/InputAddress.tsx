import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { ValidationOptions } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";
import { Coins } from "@arkecosystem/platform-sdk";

export type InputAddressProps = {
	coin?: string;
	network?: string;
	registerRef?: (options: ValidationOptions) => (ref: HTMLInputElement | null) => void;
	additionalRules?: ValidationOptions;
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
		const coin: Coins.Coin = await env.coin(coin as string, network as string);
		const isValidAddress: boolean = await coin.identity().address().validate(address);

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
		<InputGroup className="max-w-20">
			<Input
				ref={registerRef?.(rules)}
				type="text"
				className="pr-12"
				data-testid="InputAddress__input"
				{...props}
			/>
			<InputAddonEnd className="my-px mr-4">
				<button
					data-testid="InputAddress__qr-button"
					type="button"
					className="flex items-center justify-center w-full h-full text-2xl focus:outline-none bg-theme-background text-theme-primary-400"
					onClick={onQRCodeClick}
				>
					<Icon name="Qrcode" width={20} height={20} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
};

InputAddress.defaultProps = {
	additionalRules: {},
	useDefaultRules: true,
};
