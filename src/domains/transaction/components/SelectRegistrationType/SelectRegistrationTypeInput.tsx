import { Icon } from "app/components/Icon";
import { Input, InputAddon, InputAddonStart, InputGroup } from "app/components/Input";
import React from "react";

type Props = {
	suggestion?: string;
} & React.InputHTMLAttributes<any>;

const TypeAhead = ({ value }: { value?: string }) => (
	<InputAddon
		as="span"
		data-testid="SelectRegistrationTypeInput__typeahead"
		className="py-3 font-normal border border-transparent opacity-50 pointer-events-none pl-15"
	>
		{value}
	</InputAddon>
);

export const SelectRegistrationTypeInput = React.forwardRef<HTMLInputElement, Props>(
	({ suggestion, ...props }: Props, ref) => (
		<InputGroup data-testid="SelectRegistrationTypeInput">
			<InputAddonStart className="px-4">
				{/* TODO: add type name */}
				<Icon name="Product" width={22} height={22} />
			</InputAddonStart>
			{suggestion && <TypeAhead value={suggestion} />}
			<Input data-testid="SelectRegistrationTypeInput__input" ref={ref} className="pl-15" {...props} />
		</InputGroup>
	),
);

SelectRegistrationTypeInput.displayName = "SelectRegistrationTypeInput";
