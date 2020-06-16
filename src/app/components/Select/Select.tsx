import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import React from "react";

type SelectProps = { isInvalid?: boolean } & React.SelectHTMLAttributes<any>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ placeholder, children, ...props }: SelectProps, ref) => {
		return (
			<InputGroup>
				<Input data-testid="Select" as="select" ref={ref} className="pr-12" {...props}>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{children}
				</Input>
				<InputAddonEnd className="w-12 text-lg pointer-events-none text-theme-neutral-dark">
					<Icon name="ChevronDown" />
				</InputAddonEnd>
			</InputGroup>
		);
	},
);

Select.displayName = "Select";
Select.defaultProps = {
	defaultValue: "",
};
