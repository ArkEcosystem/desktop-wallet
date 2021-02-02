import React, { useState } from "react";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type Props = { maxLength?: number; maxLengthLabel?: string; defaultValue?: string } & React.InputHTMLAttributes<any>;

export const InputCounter = React.forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
	const [length, setLength] = useState(props.defaultValue?.length || 0);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLength(event.target.value.length);
		props.onChange?.(event);
	};

	return (
		<InputGroup>
			<Input data-testid="InputCounter__input" className="pr-18" ref={ref} {...props} onChange={handleChange} />
			<InputAddonEnd
				data-testid="InputCounter__counter"
				className="px-2 text-sm pointer-events-none text-theme-secondary-500"
			>
				{length}/{props.maxLengthLabel}
			</InputAddonEnd>
		</InputGroup>
	);
});

InputCounter.displayName = "InputCounter";
