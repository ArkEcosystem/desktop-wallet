import { InputRange } from "app/components/Input";
import React from "react";

interface Props {
	onChange: (value: string) => void;
	value: string;
	min: string;
	max: string;
	step: number;
	disabled: boolean;
}

export const InputFeeAdvanced = ({ onChange, value, min, max, step, disabled }: Props) => (
	<InputRange disabled={disabled} value={value} min={+min} max={+max} step={step} onChange={onChange} />
);
