import React from "react";
import { Input } from "./Input";
import { InputGroup } from "./InputGroup";
import { getTrackBackground } from "react-range";
import { Range } from "app/components/Range";

type Props = {
	defaultValue: number;
	min: number;
	max: number;
	step: number;
};

export const InputRange = React.forwardRef<HTMLInputElement, Props>(({ min, max, step, defaultValue }: Props, ref) => {
	const [values, setValues] = React.useState([defaultValue]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setValues([parseInt(value)]);
	};

	return (
		<InputGroup>
			{/* TODO: Change to InputCurrency to handle decimals/scientific notation */}
			<Input
				style={{
					background: getTrackBackground({
						values,
						colors: ["rgba(var(--theme-color-primary-rgb), 0.1)", "transparent"],
						min,
						max,
					}),
				}}
				type="text"
				onChange={handleInput}
				value={values[0]}
				ref={ref}
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
});

InputRange.displayName = "InputRange";
