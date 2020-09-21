import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useLayoutEffect, useState } from "react";

import { Input } from "./Input";

type Props = { onChange?: (value: { display: string; value: string }) => void; magnitude?: number } & Omit<
	React.InputHTMLAttributes<any>,
	"onChange" | "defaultValue"
>;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, magnitude, ...props }: Props, ref) => {
		const convertValue = useCallback((value: string) => Currency.fromString(value || "", magnitude), [magnitude]);
		const [amount, setAmount] = useState(convertValue(value?.toString() || ""));

		useLayoutEffect(() => {
			const evaluateValue = (value: any) => {
				if (value?.display) return value;

				return convertValue(value?.toString()) || convertValue("");
			};

			setAmount(evaluateValue(value));
		}, [convertValue, onChange, value]);

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
