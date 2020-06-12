import React from "react";
import { Input, InputGroup, InputAddonEnd } from "app/components/Input";
import { Icon } from "app/components/Icon";

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
