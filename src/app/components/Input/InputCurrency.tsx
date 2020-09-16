import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useLayoutEffect, useState } from "react";

import { Input } from "./Input";

type Props = { onChange?: (value: { display: string; value: string }) => void; magnitude?: number } & Omit<
	React.InputHTMLAttributes<any>,
	"onChange" | "defaultValue"
>;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, magnitude, ...props }: Props, ref) => {
		const convertValue = useCallback((value: string) => Currency.fromString(value, magnitude), [magnitude]);
		const defaultValue = value?.toString() || "";
		const [amount, setAmount] = useState(convertValue(defaultValue));

		useLayoutEffect(() => {
			setAmount(convertValue(defaultValue));
		}, [defaultValue, convertValue, onChange]);

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;
			const currency = convertValue(value);

			setAmount(currency);
			onChange?.(currency);
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
