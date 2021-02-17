import { Input, InputAddon, InputGroup } from "app/components/Input";
import React from "react";

type Props = {
	suggestion?: string;
	errorClassName?: string;
} & React.InputHTMLAttributes<any>;

const TypeAhead = ({ value, className }: { value?: string; className?: string }) => (
	<InputAddon
		as="span"
		data-testid="SelectDropdownInput__typeahead"
		className={`py-3 pl-4 font-normal border border-transparent opacity-50 pointer-events-none ${className}`}
	>
		{value}
	</InputAddon>
);

export const SelectDropdownInput = React.forwardRef<HTMLInputElement, Props>(({ suggestion, ...props }: Props, ref) => (
	<InputGroup data-testid="SelectDropdownInput">
		{suggestion && <TypeAhead value={suggestion} className={props.className} />}
		<Input data-testid="SelectDropdownInput__input" ref={ref} {...props} />
	</InputGroup>
));

SelectDropdownInput.displayName = "SelectDropdownInput";
