import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "./Input";

type Props = {
	addons?: any;
	onChange?: (value: any) => void;
	as?: React.ElementType<any>;
} & Omit<React.InputHTMLAttributes<any>, "onChange" | "defaultValue">;

const sanitizeValue = (x?: string) => Currency.fromString(x || "").display;

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, as: Component, children, ...props }: Props, ref: any) => {
		const [amount, setAmount] = useState<string>(sanitizeValue(value?.toString()));

		useEffect(() => {
			// when value is changed outside, update amount as well
			setAmount(sanitizeValue(value?.toString()));
		}, [value]);

		ref = useRef<HTMLInputElement>();

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const sanitizedValue = sanitizeValue(event.target.value);

			setAmount(sanitizedValue);
			onChange?.(sanitizedValue);
		};

		if (Component) {
			return <Component value={amount} onChange={handleInput} ref={ref} {...props} />;
		}

		return (
			<div className="relative">
				<Input
					data-testid="InputCurrency"
					type="text"
					value={amount}
					onChange={handleInput}
					ref={ref}
					{...props}
				/>
				{children}
			</div>
		);
	},
);

InputCurrency.displayName = "InputCurrency";
