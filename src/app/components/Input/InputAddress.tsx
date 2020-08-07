import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type InputAddressProps = {
	coin: string;
	network: string;
	isRequired?: boolean;
	onValidAddress?: (address: string) => void;
} & React.InputHTMLAttributes<any>;

export const InputAddress = ({ coin, network, isRequired, onValidAddress, ...props }: InputAddressProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const form = useFormContext();

	const [validAddress, setValidAddress] = useState<string | null>(null);

	const validateAddress = async (address: string) => {
		if (validAddress && validAddress !== address) {
			setValidAddress(null);
			onValidAddress?.("");
			return t("COMMON.INPUT_ADDRESS.VALIDATION.NOT_VALID");
		}

		const isValidAddress = await env.dataValidator().address(coin, network, address);

		if (isValidAddress) {
			setValidAddress(address);
			onValidAddress?.(address);
			return isValidAddress;
		}

		return t("COMMON.INPUT_ADDRESS.VALIDATION.NOT_VALID");
	};

	return (
		<InputGroup className="max-w-20">
			<Input
				ref={form?.register({
					required: isRequired
						? t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.ADDRESS"),
						  }).toString()
						: false,
					validate: validateAddress,
				})}
				type="text"
				className="pr-12"
				data-testid="InputAddress"
				{...props}
			/>
			<InputAddonEnd className="my-px mr-4">
				<button
					type="button"
					className="flex items-center justify-center w-full h-full text-2xl focus:outline-none bg-theme-background text-theme-primary-400"
				>
					<Icon name="Qrcode" width={20} height={20} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
};

InputAddress.defaultProps = {
	isRequired: false,
};
