import React from "react";

import { useFormField } from "./useFormField";

interface FormHelperTextProperties {
	isInvalid?: boolean;
	errorMessage?: React.ReactNode;
	children?: React.ReactNode;
}

export function FormHelperText({ children, ...properties }: FormHelperTextProperties) {
	const fieldContext = useFormField();
	const isInvalid = properties.isInvalid || fieldContext?.isInvalid;
	const errorMessage = properties.errorMessage || fieldContext?.errorMessage;

	if (isInvalid) {
		return <p className="text-sm font-normal text-theme-danger-500">{errorMessage}</p>;
	}

	if (children) {
		return <p className="text-sm font-normal text-theme-secondary-500">{children}</p>;
	}

	return null;
}
