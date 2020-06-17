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
		return <p className="text-sm text-theme-danger">{errorMessage}</p>;
	}

	if (children) {
		return <p className="text-sm text-theme-neutral">{children}</p>;
	}

	return null;
}
