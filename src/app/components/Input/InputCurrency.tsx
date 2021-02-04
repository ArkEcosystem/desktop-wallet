import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useEffect, useState } from "react";

import { Input } from "./Input";
import { InputGroup } from "./InputGroup";

type Props = { onChange?: (value: any) => void; magnitude?: number; errorClassName?: string } & Omit<
	React.InputHTMLAttributes<any>,
	"onChange" | "defaultValue"
>;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, magnitude, children, errorClassName, ...props }: Props, ref) => {
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

		return (
			<InputGroup>
				<Input
					data-testid="InputCurrency"
					type="text"
					value={amount.display}
					onChange={handleInput}
					ref={ref}
					{...props}
					errorClassName={errorClassName}
				/>
				{children}
			</InputGroup>
		);
	},
);

InputCurrency.displayName = "InputCurrency";
InputCurrency.defaultProps = {
	magnitude: 8,
};
