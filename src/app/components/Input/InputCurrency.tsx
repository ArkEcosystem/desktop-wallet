import { Currency } from "@arkecosystem/platform-sdk-intl";
import React from "react";

import { Input } from "./Input";

type Props = { onChange?: (value: string) => void; magnitude?: number } & Omit<
	React.InputHTMLAttributes<any>,
	"onChange" | "defaultValue"
>;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, magnitude, ...props }: Props, ref) => {
		const convertValue = React.useCallback((value: string) => Currency.fromString(value, magnitude), [magnitude]);
		const defaultValue = value?.toString() || "";
		const [amount, setAmount] = React.useState(convertValue(defaultValue));

		React.useLayoutEffect(() => {
			setAmount(convertValue(defaultValue));
		}, [defaultValue, convertValue, onChange]);

		// TODO: How we should handle entries with . like 4.1 ?
		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;
			console.log("currency input change", { value });
			const currency = convertValue(event.target.value);
			console.log({ currency });

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
