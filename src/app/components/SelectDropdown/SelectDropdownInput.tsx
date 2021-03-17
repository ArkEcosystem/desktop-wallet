import { Input } from "app/components/Input";
import React from "react";

type Props = {
	addons?: any;
	suggestion?: string;
} & React.InputHTMLAttributes<any>;

export const SelectDropdownInput = React.forwardRef<HTMLInputElement, Props>(({ suggestion, ...props }: Props, ref) => (
	<Input data-testid="SelectDropdownInput__input" suggestion={suggestion} ref={ref} {...props} />
));

SelectDropdownInput.displayName = "SelectDropdownInput";
