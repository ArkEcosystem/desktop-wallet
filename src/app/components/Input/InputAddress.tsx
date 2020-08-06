import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type InputAddressProps = {
	name: string;
	coin: string;
	network: string;
	isRequired?: boolean;
	onValidAddress?: (isValidAddress: boolean) => void;
} & React.InputHTMLAttributes<any>;

export const InputAddress = React.forwardRef<HTMLInputElement, InputAddressProps>(
	({ name, coin, network, isRequired, onValidAddress }: InputAddressProps, ref) => {
		const { t } = useTranslation();
		const { env } = useEnvironmentContext();
		const { register } = useFormContext();

		const [validAddress, setValidAddress] = useState<string | null>(null);

		const validateAddress = async (address: string) => {
			if (validAddress && validAddress !== address) {
				setValidAddress(null);
				return t("COMMON.INPUT_ADDRESS.VALIDATION.NOT_VALID");
			}

			const isValidAddress = await env.dataValidator().address(coin, network, address);

			if (isValidAddress) {
				setValidAddress(address);
				return isValidAddress;
			}

			return t("COMMON.INPUT_ADDRESS.VALIDATION.NOT_VALID");
		};

		return (
			<InputGroup className="max-w-20">
				<Input
					ref={register({
						required: isRequired
							? t("COMMON.VALIDATION.FIELD_REQUIRED", {
									field: t("COMMON.ADDRESS"),
							  }).toString()
							: false,
						validate: validateAddress,
					})}
					type="text"
					className="pr-12"
					data-testid={`InputAddress__input--${name}`}
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
	},
);

InputAddress.displayName = "InputAddress";
InputAddress.defaultProps = {
	isRequired: false,
};
