import cn from "classnames";
import React, { useState } from "react";

import { useFormField } from "../Form/useFormField";
import { Input } from "./Input";

type Props = {
	maxLength?: number;
	maxLengthLabel?: string;
	defaultValue?: string;
} & React.InputHTMLAttributes<any>;

export const InputCounter = React.forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
	const fieldContext = useFormField();
	const [length, setLength] = useState(props.defaultValue?.length || 0);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLength(event.target.value.length);
		props.onChange?.(event);
	};

	return (
		<Input
			data-testid="InputCounter__input"
			ref={ref}
			{...props}
			onChange={handleChange}
			addons={{
				end: (
					<span
						data-testid="InputCounter__counter"
						className={cn("font-semibold text-sm", {
							"text-theme-secondary-500 dark:text-theme-secondary-700": !fieldContext?.isInvalid,
						})}
					>
						{length}/{props.maxLengthLabel}
					</span>
				),
			}}
		/>
	);
});

InputCounter.displayName = "InputCounter";
