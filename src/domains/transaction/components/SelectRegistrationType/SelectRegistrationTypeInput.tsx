import { Icon } from "app/components/Icon";
import { Input, InputAddon, InputAddonStart, InputGroup } from "app/components/Input";
import React from "react";

import { Option } from "./SelectRegistrationType";

type Props = {
	suggestion?: string;
	type?: Option;
} & React.InputHTMLAttributes<any>;

const TypeAhead = ({ hasType, value }: { hasType: boolean; value?: string }) => (
	<InputAddon
		as="span"
		data-testid="SelectRegistrationTypeInput__typeahead"
		className={`py-3 font-normal border border-transparent opacity-50 pointer-events-none ${
			hasType ? "pl-12" : "pl-4"
		}`}
	>
		{value}
	</InputAddon>
);

export const SelectRegistrationTypeInput = React.forwardRef<HTMLInputElement, Props>(
	({ suggestion, type, ...props }: Props, ref) => (
		<InputGroup data-testid="SelectRegistrationTypeInput">
			{type && (
				<InputAddonStart className="px-4">
					<Icon
						name={
							type.value === "multiSignature"
								? "Multisig"
								: type.value === "secondSignature"
								? "Key"
								: type.label
						}
						width={22}
						height={22}
					/>
				</InputAddonStart>
			)}
			{suggestion && <TypeAhead hasType={!!type} value={suggestion} />}
			<Input
				data-testid="SelectRegistrationTypeInput__input"
				ref={ref}
				className={type ? "pl-12" : ""}
				{...props}
			/>
		</InputGroup>
	),
);

SelectRegistrationTypeInput.displayName = "SelectRegistrationTypeInput";
