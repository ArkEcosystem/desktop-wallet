import { useFormField } from "app/components/Form/useFormField";
import { Range } from "app/components/Range";
import { useCurrencyDisplay } from "app/hooks";
import cn from "classnames";
import React, { useEffect, useMemo } from "react";
import { getTrackBackground } from "react-range";

import { InputCurrency } from "./InputCurrency";
import { sanitizeStep } from "./utils";

type CurrencyInput = {
	display: string;
	value: string;
};

type Props = {
	disabled?: boolean;
	value?: CurrencyInput;
	avg: any;
	min: string;
	max: string;
	step: number;
	name?: string;
	magnitude?: number;
	onChange?: any;
};

export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, avg, magnitude, onChange, value, disabled }: Props, ref) => {
		const { formatRange, convertToCurrency } = useCurrencyDisplay();
		const fieldContext = useFormField();
		const [inputValue, setInputValue] = React.useState<CurrencyInput>(convertToCurrency(avg));

		const rangeValues = useMemo(() => formatRange(inputValue, max), [formatRange, max, inputValue]);
		const trackBackgroundMinValue = Number(inputValue.display);
		const minValue = Math.min(Number(min), trackBackgroundMinValue);

		useEffect(() => {
			setInputValue(convertToCurrency(value));
		}, [value, convertToCurrency]);

		const handleInput = (currency: CurrencyInput) => {
			setInputValue(currency);
			onChange?.(currency);
		};

		const handleRange = (values: number[]) => {
			const amount = convertToCurrency(values[0].toString());
			onChange?.(amount);
		};

		const backgroundColor = !fieldContext?.isInvalid
			? "rgba(var(--theme-color-primary-rgb), 0.1)"
			: "rgba(var(--theme-color-danger-rgb), 0.1)";

		return (
			<InputCurrency
				disabled={disabled}
				style={
					disabled
						? undefined
						: {
								background: getTrackBackground({
									values: [trackBackgroundMinValue],
									colors: [backgroundColor, "transparent"],
									min: minValue,
									max: Number(max),
								}),
						  }
				}
				className={cn({ "pr-12": fieldContext?.isInvalid })}
				magnitude={magnitude}
				value={inputValue.display}
				ref={ref}
				onChange={handleInput}
			>
				{!disabled && Number(min) < Number(max) && (
					<div className="absolute bottom-0 px-1 w-full">
						<Range
							step={sanitizeStep({ min: Number(minValue), max: Number(max), step })}
							isInvalid={fieldContext?.isInvalid}
							min={minValue}
							max={Number(max)}
							onChange={handleRange}
							values={rangeValues}
						/>
					</div>
				)}
			</InputCurrency>
		);
	},
);

InputRange.displayName = "InputRange";
InputRange.defaultProps = {
	magnitude: 8,
};
