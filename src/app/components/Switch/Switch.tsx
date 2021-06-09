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
	small?: boolean;
}

export function Switch<TOptionValue = string>({
	value,
	onChange,
	leftOption,
	rightOption,
	className,
	small,
}: Props<TOptionValue>) {
	const renderOption = (option: SwitchOption<TOptionValue>) => (
		<SwitchText
			role="button"
			onClick={() => onChange(option.value)}
			selected={option.value === value}
			small={small}
		>
			{option.label}
		</SwitchText>
	);

	return (
		<div className={cn("flex items-center", className)}>
			{renderOption(leftOption)}

			<div className={small ? "mx-2" : "mx-4"}>
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
