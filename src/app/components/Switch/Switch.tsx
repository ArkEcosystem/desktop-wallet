import cn from "classnames";
import React, { PropsWithChildren } from "react";
import { styled } from "twin.macro";
import { Size } from "types";

import { Toggle } from "../Toggle";
import { getSwitchTextStyles, SwitchTextType } from "./SwitchText.style";

const SwitchText = styled.span<PropsWithChildren<SwitchTextType>>(getSwitchTextStyles);

export interface SwitchOption<TValue = string> {
	label: string;
	value: TValue;
}

interface Properties<TOptionValue = string> {
	value: TOptionValue;
	onChange: (value: TOptionValue) => void;
	leftOption: SwitchOption<TOptionValue>;
	rightOption: SwitchOption<TOptionValue>;
	size?: Size;
	disabled?: boolean;
	className?: string;
}

export function Switch<TOptionValue = string>({
	value,
	onChange,
	leftOption,
	rightOption,
	size,
	disabled,
	className,
}: Properties<TOptionValue>) {
	const renderOption = (option: SwitchOption<TOptionValue>) => (
		<SwitchText
			role="button"
			disabled={disabled}
			size={size}
			selected={option.value === value}
			onClick={() => !disabled && onChange(option.value)}
		>
			{option.label}
		</SwitchText>
	);

	return (
		<div className={cn("flex items-center", className)}>
			{renderOption(leftOption)}

			<Toggle
				alwaysOn
				small={size === "sm"}
				disabled={disabled}
				checked={rightOption.value === value}
				onChange={() => onChange(rightOption.value === value ? leftOption.value : rightOption.value)}
			/>

			{renderOption(rightOption)}
		</div>
	);
}
