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
};

export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, defaultValue, magnitude }: Props, ref) => {
		const [values, setValues] = React.useState([defaultValue]);

		const handleInput = (value: string) => {
			const fraction = Math.pow(10, magnitude! * -1);
			const amount = BigNumber.make(value).times(fraction);
			setValues([amount.toNumber()]);
		};

		const trackBackgroundMinValue = Math.max(values[0], 3);

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
						onChange={setValues}
						values={values}
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
