import cn from "classnames";
import React from "react";

import { Toggle } from "../Toggle";
import { SwitchText } from "./SwitchText";

interface SwitchOption<TValue> {
	label: string;
	value: TValue;
}

export type SwitchOptions<TValue = string> = [SwitchOption<TValue>, SwitchOption<TValue>];

interface Props<TOptionValue = string> {
	value: TOptionValue;
	onChange: (value: TOptionValue) => void;
	options: SwitchOptions<TOptionValue>;
	className?: string;
}

export function Switch<TOptionValue = string>({ value, onChange, options, className }: Props<TOptionValue>) {
	const [left, right] = options;

	const renderOption = (option: SwitchOption<TOptionValue>) => (
		<SwitchText role="button" selected={option.value === value} onClick={() => onChange(option.value)}>
			{option.label}
		</SwitchText>
	);

	return (
		<div className={cn("flex items-center", className)}>
			{renderOption(left)}

			<div className="mx-4">
				<Toggle
					alwaysOn
					checked={right.value === value}
					onChange={() => onChange(right.value === value ? left.value : right.value)}
				/>
			</div>

			{renderOption(right)}
		</div>
	);
}
