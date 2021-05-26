import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

import { Input } from "./Input";

type Props = {
	addons?: any;
	onChange?: (value: any) => void;
	as?: React.ElementType<any>;
} & Omit<React.InputHTMLAttributes<any>, "onChange" | "defaultValue">;

interface ISelectionRange {
	start: number | null;
	end: number | null;
}

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, as: Component, children, ...props }: Props, ref: any) => {
		const sanitizeValue = useCallback((value?: string) => Currency.fromString(value ?? "").display, []);

		const [amount, setAmount] = useState<string>(sanitizeValue(value?.toString()));
		const [selectionRange, setSelectionRange] = useState<ISelectionRange>({
			start: null,
			end: null,
		});

		ref = useRef<HTMLInputElement>();

		const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
			setSelectionRange({
				start: event.target.selectionStart,
				end: event.target.selectionEnd,
			});

			const sanitizedValue = sanitizeValue(event.target.value);

			setAmount(sanitizedValue);
			onChange?.(sanitizedValue);
		};

		useLayoutEffect(() => {
			ref.current.setSelectionRange(selectionRange.start, selectionRange.end);
		}, [amount, ref, selectionRange.start, selectionRange.end]);

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
