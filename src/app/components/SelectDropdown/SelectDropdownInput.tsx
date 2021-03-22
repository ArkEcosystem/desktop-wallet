import { Input } from "app/components/Input";
import React from "react";

type Props = {
	addons?: any;
	innerClassName?: string;
	suggestion?: string;
} & React.InputHTMLAttributes<any>;

export const SelectDropdownInput = React.forwardRef<HTMLInputElement, Props>(({ ...props }: Props, ref) => (
	<Input data-testid="SelectDropdownInput__input" ref={ref} {...props} />
));

SelectDropdownInput.displayName = "SelectDropdownInput";
