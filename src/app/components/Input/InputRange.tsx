import { Currency } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Range } from "app/components/Range";
import React, { useCallback, useEffect } from "react";
import { getTrackBackground } from "react-range";

import { InputCurrency } from "./InputCurrency";
import { InputGroup } from "./InputGroup";

type Props = {
	defaultValue: any;
	value?: string;
	min: number;
	max: number;
	step: number;
	name?: string;
	magnitude?: number;
	onChange?: any;
};

// TODO: tidy up storage of amount (why array of values?)
export const InputRange = React.forwardRef<HTMLInputElement, Props>(
	({ min, max, step, defaultValue, magnitude, onChange, value }: Props, ref) => {
		const [values, setValues] = React.useState<any>([BigNumber.make(defaultValue).divide(1e8)]);
		const convertValue = useCallback((value: string) => Currency.fromString(value, magnitude), [magnitude]);
		const fraction = Math.pow(10, magnitude! * -1);

		const handleInput = (currency: { display: string; value: string }) => {
			let value = currency.display;

			if (BigNumber.make(currency.value).divide(1e8).toNumber() > max) {
				value = BigNumber.make(max).toString();
			}

			setValues([value]);
			onChange?.(currency);
		};

		const handleRange = (values: number[]) => {
			const amount = convertValue(values[0].toString());

			setValues([amount]);
			onChange?.(amount);
		};

		let trackBackgroundMinValue = values[0];
		let rangeValues = [Math.min(values[0], max)];

		if (values[0]?.value) {
			const rangeValue = BigNumber.make(values[0].value).divide(1e8);
			trackBackgroundMinValue = rangeValue;
			rangeValues = [Math.min(rangeValue.toNumber(), max)];
		}

		useEffect(() => {
			if (value) {
				setValues([value.display]);
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
