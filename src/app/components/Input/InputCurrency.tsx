import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "./Input";

type Properties = {
	addons?: any;
	onChange?: (value: any) => void;
	as?: React.ElementType<any>;
} & Omit<React.InputHTMLAttributes<any>, "onChange" | "defaultValue">;

const sanitize = (value?: string) => Currency.fromString(value || "").display;

export const InputCurrency = React.forwardRef<HTMLInputElement, Properties>(
	({ onChange, value, as: Component, children, ...properties }: Properties, reference: any) => {
		const [amount, setAmount] = useState<string>(sanitize(value?.toString()));

		useEffect(() => {
			// when value is changed outside, update amount as well
			setAmount(sanitize(value?.toString()));
		}, [value]);

		reference = useRef<HTMLInputElement>();

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			const sanitizedValue = sanitize(event.target.value);

			setAmount(sanitizedValue);
			onChange?.(sanitizedValue);
		};

		if (Component) {
			return <Component value={amount} onChange={handleInput} ref={reference} {...properties} />;
		}

		return (
			<div className="relative">
				<Input
					data-testid="InputCurrency"
					type="text"
					value={amount}
					onChange={handleInput}
					ref={reference}
					{...properties}
				/>
				{children}
			</div>
		);
	},
);

InputCurrency.displayName = "InputCurrency";
