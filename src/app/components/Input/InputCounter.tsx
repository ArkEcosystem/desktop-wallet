import React from "react";
import { Input } from "./Input";
import { InputGroup, InputAddonEnd } from "./InputGroup";

type Props = { maxLength: number; defaultValue?: string } & React.InputHTMLAttributes<any>;

export const InputCounter = React.forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
	const [length, setLength] = React.useState(props.defaultValue?.length || 0);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLength(event.target.value.length);
		props.onChange?.(event);
	};

	return (
		<InputGroup>
			<Input
				data-testid="InputCounter__input"
				type="text"
				className="pr-18"
				ref={ref}
				onChange={handleChange}
				{...props}
			/>
			<InputAddonEnd
				data-testid="InputCounter__counter"
				className="px-2 text-sm pointer-events-none text-theme-neutral"
			>
				{length}/{props.maxLength}
			</InputAddonEnd>
		</InputGroup>
	);
});

InputCounter.displayName = "InputCounter";
