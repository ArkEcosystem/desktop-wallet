import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useLayoutEffect, useState } from "react";

import { Input } from "./Input";

type Props = {
	onChange?: (value: any) => void;
	magnitude?: number;
	defaultValue?: any;
} & Omit<React.InputHTMLAttributes<any>, "onChange">;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, magnitude, defaultValue, ...props }: Props, ref) => {
		const convertValue = useCallback((value: string) => Currency.fromString(value || "", magnitude), [magnitude]);
		const [amount, setAmount] = useState(convertValue(defaultValue));

		useLayoutEffect(() => {
			const evaluateValue = (value: any) => {
				if (value?.display) return value;

				return convertValue(value);
			};

			setAmount(evaluateValue(value));
		}, [convertValue, onChange, value]);

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;

			onChange?.(value);
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
