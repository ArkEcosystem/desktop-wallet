import { Input } from "app/components/Input";
import cn from "classnames";
import React from "react";

type Props = {
	addons?: any;
	suggestion?: string;
	errorClassName?: string;
} & React.InputHTMLAttributes<any>;

const TypeAhead = ({ value, className }: { value?: string; className?: string }) => (
	<span
		data-testid="SelectDropdownInput__typeahead"
		className={cn(
			"absolute flex items-center inset-0 ml-px px-14 font-normal opacity-50 pointer-events-none",
			className,
		)}
	>
		{value}
	</span>
);

export const SelectDropdownInput = React.forwardRef<HTMLInputElement, Props>(({ suggestion, ...props }: Props, ref) => (
	<div data-testid="SelectDropdownInput" className="relative">
		{suggestion && <TypeAhead value={suggestion} className={props.className} />}
		<Input data-testid="SelectDropdownInput__input" ref={ref} {...props} />
	</div>
));

SelectDropdownInput.displayName = "SelectDropdownInput";
