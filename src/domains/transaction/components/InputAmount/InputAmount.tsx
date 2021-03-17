import { InputCurrency } from "app/components/Input";
import React from "react";

type InputAmountProps = {
	addons?: any;
	onChange?: (value: any) => void;
} & Omit<React.InputHTMLAttributes<any>, "onChange" | "defaultValue">;

export const InputAmount = ({ addons, ...props }: InputAmountProps) => <InputCurrency addons={addons} {...props} />;

InputAmount.displayName = "InputAmount";
