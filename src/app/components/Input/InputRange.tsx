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

// TODO: tidy up storage of amount (why array of values?)
export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, avg, magnitude, onChange, value, disabled }: Props, ref) => {
		const { formatRange, convertToCurrency } = useCurrencyDisplay();
		const fieldContext = useFormField();
		const [values, setValues] = React.useState<CurrencyInput[]>([convertToCurrency(avg)]);

		const rangeValues = useMemo(() => formatRange(values, max), [formatRange, max, values]);
		const trackBackgroundMinValue = Number(values[0].display);
		const minValue = Math.min(Number(min), trackBackgroundMinValue);

		useEffect(() => {
			setValues([convertToCurrency(value)]);
		}, [value, convertToCurrency]);

		const handleInput = (currency: CurrencyInput) => {
			setValues([currency]);
			onChange?.(currency);
		};

		const handleRange = (values: number[]) => {
			const amount = convertToCurrency(values[0].toString());
			onChange?.(amount);
		};

		return (
			<InputCurrency
				disabled={disabled}
				style={
					disabled
						? undefined
						: {
								background: getTrackBackground({
									values: [trackBackgroundMinValue],
									colors: ["rgba(var(--theme-color-primary-rgb), 0.1)", "transparent"],
									min: minValue,
									max: Number(max),
								}),
						  }
				}
				className={cn({ "pr-12": fieldContext?.isInvalid })}
				magnitude={magnitude}
				value={values[0].display}
				ref={ref}
				onChange={handleInput}
			>
				{!disabled && Number(min) < Number(max) && (
					<div className="absolute bottom-0 px-1 w-full">
						<Range
							colors={["var(--theme-color-primary-600)", "transparent"]}
							step={sanitizeStep({ min: Number(minValue), max: Number(max), step })}
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
