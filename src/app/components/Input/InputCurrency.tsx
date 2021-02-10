import { Currency } from "@arkecosystem/platform-sdk-intl";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Input } from "./Input";
import { InputGroup } from "./InputGroup";

type Props = {
	onChange?: (value: any) => void;
	magnitude?: number;
	errorClassName?: string;
	as?: React.ElementType<any>;
} & Omit<React.InputHTMLAttributes<any>, "onChange" | "defaultValue">;

interface ISelectionRange {
	start: number | null;
	end: number | null;
}

export const InputCurrency = React.forwardRef<HTMLInputElement, Props>(
	({ onChange, value, as: Component, magnitude, children, errorClassName, ...props }: Props, ref: any) => {
		const convertValue = useCallback((value: string) => Currency.fromString(value || "", magnitude), [magnitude]);
		const [amount, setAmount] = useState(convertValue(value?.toString() || ""));
		const [selectionRange, setSelectionRange] = useState<ISelectionRange>({
			start: null,
			end: null,
		});

		ref = useRef<HTMLInputElement>();

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
			const { value, selectionStart, selectionEnd } = event.target;

			setSelectionRange({ start: selectionStart, end: selectionEnd });

			onChange?.(convertValue(value));

			setAmount(convertValue(value));
		};

		useLayoutEffect(() => {
			ref.current.setSelectionRange(selectionRange.start, selectionRange.end);
		}, [amount, ref, selectionRange.start, selectionRange.end]);

		if (Component) {
			return <Component value={amount.display} onChange={handleInput} ref={ref} {...props} />;
		}

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
