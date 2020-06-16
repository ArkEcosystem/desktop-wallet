import React from "react";

import { useFormField } from "./useFormField";

type FormLabelProps = { label?: string } & React.LabelHTMLAttributes<any>;

export function FormLabel(props: FormLabelProps) {
	const fieldContext = useFormField();

	return (
		<label
			data-testid="FormLabel"
			className={`FormLabel transition-colors duration-100 inline-block text-sm font-semibold text-theme-neutral-dark`}
			htmlFor={fieldContext?.name}
			{...props}
		>
			{props.label || props.children}
		</label>
	);
}
