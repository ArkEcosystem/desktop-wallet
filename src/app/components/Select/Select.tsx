import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React from "react";

type SelectProps = { isInvalid?: boolean } & React.SelectHTMLAttributes<any>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ placeholder, children, ...props }: SelectProps, ref) => (
		<Input
			data-testid="Select"
			as="select"
			ref={ref}
			addons={{
				end: (
					<span className="w-12 text-lg pointer-events-none text-theme-secondary-text">
						<Icon name="ChevronDown" />
					</span>
				),
			}}
			{...props}
		>
			{placeholder && (
				<option value="" disabled>
					{placeholder}
				</option>
			)}
			{children}
		</Input>
	),
);

Select.displayName = "Select";
Select.defaultProps = {
	defaultValue: "",
};
