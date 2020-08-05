import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Range } from "app/components/Range";
import React from "react";
import { getTrackBackground } from "react-range";

import { InputCurrency } from "./InputCurrency";
import { InputGroup } from "./InputGroup";

type Props = {
	defaultValue: number;
	min: number;
	max: number;
	step: number;
	name?: string;
	magnitude?: number;
	onChange?: (value: string) => void;
};

export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, defaultValue, magnitude, onChange }: Props, ref) => {
		const [values, setValues] = React.useState([defaultValue]);
		const fraction = Math.pow(10, magnitude! * -1);

		// TODO: tidy up storage of amount
		const handleInput = (value: string) => {
			const amount = BigNumber.make(value).divide(fraction);
			setValues([amount.toNumber()]);
			onChange?.(amount.toFixed(0));
		};
		const handleRange = (values: number[]) => {
			const amount = BigNumber.make(values[0]).divide(fraction);
			setValues(values);
			onChange?.(amount.toFixed(0));
		};

		const trackBackgroundMinValue = Math.max(values[0], 3);
		const rangeValues = [Math.min(values[0], max)];

		return (
			<InputGroup>
				<InputCurrency
					style={{
						background: getTrackBackground({
							values: [trackBackgroundMinValue],
							colors: ["rgba(var(--theme-color-primary-rgb), 0.1)", "transparent"],
							min,
							max,
						}),
					}}
					magnitude={magnitude}
					type="text"
					value={values[0]}
					ref={ref}
					onChange={handleInput}
				/>
				<div className="absolute bottom-0 w-full px-1">
					<Range
						colors={["var(--theme-color-primary)", "transparent"]}
						step={step}
						min={min}
						max={max}
						onChange={handleRange}
						values={rangeValues}
					/>
				</div>
			</InputGroup>
		);
	},
);

InputRange.displayName = "InputRange";
InputRange.defaultProps = {
	magnitude: 8,
};
