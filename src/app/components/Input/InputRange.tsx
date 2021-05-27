import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useFormField } from "app/components/Form/useFormField";
import { Range } from "app/components/Range";
import cn from "classnames";
import React, { useMemo } from "react";
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
	({ value, onChange, step, disabled, max, ...props }: Props, ref) => {
		const fieldContext = useFormField();

		// @TODO could be simplified after SDK update
		const rangeValues = useMemo<number[]>(() => {
			const sanitized = BigNumber.make(value);
			/* istanbul ignore next */
			return isNaN(sanitized.toNumber()) ? [] : [Math.min(sanitized.toNumber(), max)];
		}, [value, max]);

		const min = Math.min(props.min, +value);

		const backgroundColor = !fieldContext?.isInvalid
			? "rgba(var(--theme-color-primary-rgb), 0.1)"
			: "rgba(var(--theme-color-danger-rgb), 0.1)";

		const sanitizedStep = sanitizeStep({ min, max, step });

		const handleRangeChange = ([rangeValue]: number[]) => {
			onChange(rangeValue.toString());
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
				ref={ref}
				onChange={onChange}
			>
				{!disabled && min < max && (
					<div className={cn("absolute bottom-0 px-1 w-full", { invisible: !rangeValues.length })}>
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
