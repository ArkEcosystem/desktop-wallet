import React from "react";

import { useFormField } from "./useFormField";

type FormHelperTextProps = {
	isInvalid?: boolean;
	errorMessage?: React.ReactNode;
	children?: React.ReactNode;
};

export function FormHelperText({ children, ...props }: FormHelperTextProps) {
	const fieldContext = useFormField();
	const isInvalid = props.isInvalid || fieldContext?.isInvalid;
	const errorMessage = props.errorMessage || fieldContext?.errorMessage;

	if (isInvalid) {
		return <p className="font-normal text-sm text-theme-danger-500">{errorMessage}</p>;
	}

	if (children) {
		return <p className="font-normal text-sm text-theme-secondary-500">{children}</p>;
	}

	return null;
}
