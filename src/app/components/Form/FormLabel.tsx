import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { useFormField } from "./useFormField";

type FormLabelProps = {
	label?: string;
	required?: boolean;
	optional?: boolean;
} & React.LabelHTMLAttributes<any>;

export function FormLabel(props: FormLabelProps) {
	const fieldContext = useFormField();

	const labelProps = { ...props };

	for (const prop of ["label", "required", "optional"]) {
		// @ts-ignore
		delete labelProps[prop];
	}

	const { t } = useTranslation();

	return (
		<label
			data-testid="FormLabel"
			className="inline-block flex mb-2 text-sm font-semibold transition-colors duration-100 FormLabel text-theme-secondary-700"
			htmlFor={fieldContext?.name}
			{...labelProps}
		>
			{props.label || props.children}

			{props.required && (
				<Tooltip content={t("COMMON.VALIDATION.REQUIRED")}>
					<div
						data-testid="FormLabel__required"
						className="mt-1 ml-1 w-1 h-1 rounded-full bg-theme-danger-400"
					/>
				</Tooltip>
			)}

			{props.optional && (
				<Tooltip content={t("COMMON.VALIDATION.OPTIONAL")}>
					<span data-testid="FormLabel__optional" className="ml-1 text-theme-secondary-text">
						({t("COMMON.OPTIONAL")})
					</span>
				</Tooltip>
			)}
		</label>
	);
}

FormLabel.defaultProps = {
	required: true,
};
