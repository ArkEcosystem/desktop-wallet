import Tippy from "@tippyjs/react";
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
			className="flex inline-block mb-2 text-sm font-semibold FormLabel transition-colors duration-100 text-theme-neutral-dark"
			htmlFor={fieldContext?.name}
			{...labelProps}
		>
			{props.label || props.children}

			{props.required && (
				<Tippy content={t("COMMON.VALIDATION.REQUIRED")}>
					<div
						data-testid="FormLabel__required"
						className="w-1 h-1 mt-1 ml-1 rounded-full bg-theme-danger-400"
					/>
				</Tippy>
			)}

			{props.optional && (
				<Tippy content={t("COMMON.VALIDATION.OPTIONAL")}>
					<span className="ml-1 text-theme-neutral-light">{t("COMMON.OPTIONAL")}</span>
				</Tippy>
			)}
		</label>
	);
}

FormLabel.defaultProps = {
	required: false,
};
