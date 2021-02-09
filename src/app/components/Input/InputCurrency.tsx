import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useEffect, useState } from "react";

import { Input } from "./Input";

type Props = { onChange?: (value: any) => void; magnitude?: number; as?: React.ElementType<any> } & Omit<
	React.InputHTMLAttributes<any>,
	"onChange" | "defaultValue"
>;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, as: Component, magnitude, ...props }: Props, ref) => {
		const convertValue = useCallback((value: string) => Currency.fromString(value || "", magnitude), [magnitude]);
		const [amount, setAmount] = useState(convertValue(value?.toString() || ""));

		useEffect(() => {
			const evaluateValue = (value: any) => {
				if (value?.display) {
					return value;
				}

				return convertValue(value?.toString() || "");
			};

			setAmount(evaluateValue(value));
		}, [value]); // eslint-disable-line react-hooks/exhaustive-deps

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;

			onChange?.(convertValue(value));
		};

		if (Component) {
			return <Component value={amount.display} onChange={handleInput} ref={ref} {...props} />;
		}

		return <Input data-testid="InputCurrency" value={amount.display} onChange={handleInput} ref={ref} {...props} />;
	},
);

InputCurrency.displayName = "InputCurrency";
InputCurrency.defaultProps = {
	magnitude: 8,
};
