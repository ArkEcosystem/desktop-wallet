import { Currency } from "@arkecosystem/platform-sdk-intl";
import React from "react";

import { Input } from "./Input";

type Props = { onChange?: (value: string) => void; magnitude?: number } & React.InputHTMLAttributes<any>;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, magnitude, ...props }: Props, ref) => {
		const initialValue = value?.toString() || "";
		const [amount, setAmount] = React.useState(Currency.fromString(initialValue, magnitude));

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const currency = Currency.fromString(event.target.value, magnitude);
			setAmount(currency);
			onChange?.(currency.value);
		};

		return (
			<Input
				data-testid="InputCurrency"
				type="text"
				value={amount.display}
				onChange={handleInput}
				ref={ref}
				{...props}
			/>
		);
	},
);

InputCurrency.displayName = "InputCurrency";
InputCurrency.defaultProps = {
	magnitude: 8,
};
