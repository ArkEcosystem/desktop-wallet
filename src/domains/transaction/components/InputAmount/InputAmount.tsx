import { useFormField } from "app/components/Form/useFormField";
import { InputCurrency } from "app/components/Input";
import cn from "classnames";
import React from "react";

type InputAmountProps = {
	onChange?: (value: any) => void;
} & Omit<React.InputHTMLAttributes<any>, "onChange" | "defaultValue">;

export const InputAmount = ({ children, className, ...props }: InputAmountProps) => {
	const fieldContext = useFormField();

	return (
		<InputCurrency className={cn({ "pr-1/2": !fieldContext?.isInvalid })} {...props}>
			{children}
		</InputCurrency>
	);
};

InputAmount.displayName = "InputAmount";
