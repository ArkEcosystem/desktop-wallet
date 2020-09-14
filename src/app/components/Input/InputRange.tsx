import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Range } from "app/components/Range";
import React, { useEffect } from "react";
import { getTrackBackground } from "react-range";

import { InputCurrency } from "./InputCurrency";
import { InputGroup } from "./InputGroup";

type Props = {
	defaultValue: string;
	value?: string;
	min: number;
	max: number;
	step: number;
	name?: string;
	magnitude?: number;
	onChange?: (value: string) => void;
};

// TODO: tidy up storage of amount (why array of values?)
export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, defaultValue, magnitude, onChange, value }: Props, ref) => {
		const [values, setValues] = React.useState<number[]>([BigNumber.make(defaultValue).divide(1e8).toNumber()]);
		const fraction = Math.pow(10, magnitude! * -1);

		const handleInput = (value: string) => {
			console.log({ value });
			if (BigNumber.make(value).divide(1e8).toNumber() > max) {
				value = BigNumber.make(max).times(1e8).toFixed(0);
			}

			let amount = BigNumber.make(value).times(fraction);
			amount = amount.toNumber() * 1e8;

			setValues([amount]);
			onChange?.(amount.toFixed(0));
		};

		const handleRange = (values: number[]) => {
			const amount = BigNumber.make(values[0]).divide(fraction).toFixed(0);
			setValues(values);
			onChange?.(amount);
		};

		const trackBackgroundMinValue = values[0];
		const rangeValues = [Math.min(values[0], max)];

		useEffect(() => {
			if (value) {
				setValues([BigNumber.make(value).divide(1e8).toNumber()]);
			}
		}, [value]);

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
				{Number(min) < Number(max) && (
					<div className="absolute bottom-0 w-full px-1">
						<Range
							colors={["var(--theme-color-primary)", "transparent"]}
							step={step}
							min={Number(min)}
							max={Number(max)}
							onChange={handleRange}
							values={rangeValues}
						/>
					</div>
				)}
			</InputGroup>
		);
	},
);

InputRange.displayName = "InputRange";
InputRange.defaultProps = {
	magnitude: 8,
};
