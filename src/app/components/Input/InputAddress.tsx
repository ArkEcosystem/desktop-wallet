import { Coins } from "@arkecosystem/platform-sdk";
import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import cn from "classnames";
import React from "react";
import { ValidationRules } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

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
	const fieldContext = useFormField();

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
		<InputGroup className="max-w-20">
			<Input
				ref={registerRef?.(rules)}
				type="text"
				className={cn({ "pr-12": !fieldContext?.isInvalid, "pr-20": fieldContext?.isInvalid })}
				errorClassName="mr-12"
				data-testid="InputAddress__input"
				{...props}
			/>
			<InputAddonEnd className="my-px mr-4">
				<button
					data-testid="InputAddress__qr-button"
					type="button"
					className="flex justify-center items-center w-full h-full text-2xl focus:outline-none text-theme-primary-400"
					onClick={onQRCodeClick}
				>
					<Icon name="QrCode" width={20} height={20} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
};

InputAddress.defaultProps = {
	additionalRules: {},
	useDefaultRules: true,
};
