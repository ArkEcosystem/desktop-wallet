import "tippy.js/dist/tippy.css";

import Tippy from "@tippyjs/react";
import React from "react";

import { useFormField } from "./useFormField";

type FormLabelProps = {
	label?: string;
	required?: boolean;
} & React.LabelHTMLAttributes<any>;

export function FormLabel(props: FormLabelProps) {
	const fieldContext = useFormField();

	return (
		<label
			data-testid="FormLabel"
			className="flex inline-block text-sm FormLabel transition-colors duration-100 text-theme-neutral-dark"
			htmlFor={fieldContext?.name}
			{...props}
		>
			{props.label || props.children}

			{props.required && (
				<Tippy content="These fields are required to be filled in">
					<div
						data-testid="FormLabel__required"
						className="w-1 h-1 mt-1 ml-1 rounded-full bg-theme-danger-400"
					/>
				</Tippy>
			)}
		</label>
	);
}

FormLabel.defaultProps = {
	required: false,
};
