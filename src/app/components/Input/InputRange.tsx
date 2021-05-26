import { useFormField } from "app/components/Form/useFormField";
import { Range } from "app/components/Range";
import cn from "classnames";
import React from "react";
import { getTrackBackground } from "react-range";

import { InputCurrency } from "./InputCurrency";
import { sanitizeStep } from "./utils";

type Props = {
	disabled?: boolean;
	value: string;
	min: number;
	max: number;
	step: number;
	name?: string;
	onChange: (value: string) => void;
};

export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, onChange, value, disabled }: Props, ref) => {
		const fieldContext = useFormField();

		const rangeValues = [Math.min(min, 0), max];
		const minValue = Math.min(min, +value || 0);
		const maxValue = max;

		const backgroundColor = !fieldContext?.isInvalid
			? "rgba(var(--theme-color-primary-rgb), 0.1)"
			: "rgba(var(--theme-color-danger-rgb), 0.1)";

		const sanitizedStep = sanitizeStep({ min: minValue, max: maxValue, step });

		return (
			<InputCurrency
				disabled={disabled}
				style={
					disabled
						? undefined
						: {
								background: getTrackBackground({
									values: [+value || 0],
									colors: [backgroundColor, "transparent"],
									min: minValue,
									max: maxValue,
								}),
						  }
				}
				value={value}
				ref={ref}
				onChange={onChange}
			>
				{!disabled && minValue < maxValue && (
					<div className={cn("absolute bottom-0 px-1 w-full", { invisible: !rangeValues.length })}>
						<Range
							step={sanitizedStep}
							isInvalid={fieldContext?.isInvalid}
							min={minValue}
							max={maxValue}
							onChange={([x]) => onChange(x.toString())}
							values={rangeValues}
						/>
					</div>
				)}
			</InputCurrency>
		);
	},
);

InputRange.displayName = "InputRange";
