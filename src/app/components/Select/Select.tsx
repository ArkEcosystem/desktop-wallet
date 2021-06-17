import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import React from "react";

type SelectProperties = { isInvalid?: boolean } & React.SelectHTMLAttributes<any>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProperties>(
	({ placeholder, children, ...properties }: SelectProperties, reference) => (
		<Input
			data-testid="Select"
			as="select"
			ref={reference}
			addons={{
				end: (
					<span className="w-12 text-lg pointer-events-none text-theme-secondary-text">
						<Icon name="ChevronDown" />
					</span>
				),
			}}
			{...properties}
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
