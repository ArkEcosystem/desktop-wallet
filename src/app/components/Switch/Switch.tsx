import cn from "classnames";
import React from "react";

import { Toggle } from "../Toggle";
import { SwitchText } from "./SwitchText";

export interface SwitchOption<TValue = string> {
	label: string;
	value: TValue;
}

interface Props<TOptionValue = string> {
	value: TOptionValue;
	onChange: (value: TOptionValue) => void;
	leftOption: SwitchOption<TOptionValue>;
	rightOption: SwitchOption<TOptionValue>;
	className?: string;
}

export function Switch<TOptionValue = string>({
	value,
	onChange,
	leftOption,
	rightOption,
	className,
}: Props<TOptionValue>) {
	const renderOption = (option: SwitchOption<TOptionValue>) => (
		<SwitchText role="button" selected={option.value === value} onClick={() => onChange(option.value)}>
			{option.label}
		</SwitchText>
	);

	return (
		<div className={cn("flex items-center", className)}>
			{renderOption(leftOption)}

			<div className="mx-4">
				<Toggle
					alwaysOn
					checked={rightOption.value === value}
					onChange={() => onChange(rightOption.value === value ? leftOption.value : rightOption.value)}
				/>
			</div>

			{renderOption(rightOption)}
		</div>
	);
}
