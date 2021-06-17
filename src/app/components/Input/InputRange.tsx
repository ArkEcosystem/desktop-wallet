import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useFormField } from "app/components/Form/useFormField";
import { Range } from "app/components/Range";
import cn from "classnames";
import React, { useMemo } from "react";
import { getTrackBackground } from "react-range";

import { InputCurrency } from "./InputCurrency";
import { sanitizeStep } from "./utils";

interface Properties {
	disabled?: boolean;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
}

export const InputRange = React.forwardRef<HTMLInputElement, Properties>(
	({ value, onChange, step, disabled, max, ...properties }: Properties, reference) => {
		const fieldContext = useFormField();

		const rangeValues = useMemo<number[]>(() => {
			const sanitized = +value;

			/* istanbul ignore next */
			if (isNaN(sanitized) || sanitized === 0) {
				return [];
			}

			return [Math.min(sanitized, max)];
		}, [value, max]);

		const min = Math.min(properties.min, +value);

		const backgroundColor = !fieldContext?.isInvalid
			? "rgba(var(--theme-color-primary-rgb), 0.1)"
			: "rgba(var(--theme-color-danger-rgb), 0.1)";

		const sanitizedStep = sanitizeStep({ min, max, step });

		const handleRangeChange = ([rangeValue]: number[]) => {
			onChange(rangeValue);
		};

		return (
			<InputCurrency
				disabled={disabled}
				style={
					disabled
						? undefined
						: {
								background: getTrackBackground({
									values: [+value],
									colors: [backgroundColor, "transparent"],
									min,
									max,
								}),
						  }
				}
				value={value}
				ref={reference}
				onChange={onChange}
			>
				{!disabled && min < max && (
					<div className={cn("absolute bottom-0 px-1 w-full", { invisible: rangeValues.length === 0 })}>
						<Range
							step={sanitizedStep}
							isInvalid={fieldContext?.isInvalid}
							min={min}
							max={max}
							onChange={handleRangeChange}
							values={rangeValues}
						/>
					</div>
				)}
			</InputCurrency>
		);
	},
);

InputRange.displayName = "InputRange";
