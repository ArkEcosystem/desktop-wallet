import React, { useState } from "react";

import { useFormField } from "../Form/useFormField";
import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type Props = {
	maxLength?: number;
	maxLengthLabel?: string;
	defaultValue?: string;
	errorClassName?: string;
} & React.InputHTMLAttributes<any>;

export const InputCounter = React.forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
	const fieldContext = useFormField();
	const [length, setLength] = useState(props.defaultValue?.length || 0);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLength(event.target.value.length);
		props.onChange?.(event);
	};

	return (
		<InputGroup>
			<Input
				data-testid="InputCounter__input"
				className={fieldContext?.isInvalid ? "pr-28" : "pr-18"}
				ref={ref}
				{...props}
				onChange={handleChange}
			/>
			<InputAddonEnd
				data-testid="InputCounter__counter"
				className={`pl-2 text-sm pointer-events-none text-theme-secondary-500 ${
					fieldContext?.isInvalid ? "pr-12" : "pr-2"
				}`}
			>
				{length}/{props.maxLengthLabel}
			</InputAddonEnd>
		</InputGroup>
	);
});

InputCounter.displayName = "InputCounter";
