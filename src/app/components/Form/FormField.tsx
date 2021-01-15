import { get } from "@arkecosystem/utils";
import React from "react";
import { useFormContext } from "react-hook-form";
import tw, { styled } from "twin.macro";

import { FormFieldProvider } from "./useFormField";

type FormFieldProps = {
	name: string;
} & React.FieldsetHTMLAttributes<any>;

export const FormFieldStyled = styled.fieldset<{ isInvalid: boolean }>`
	&:hover .FormLabel {
		${({ isInvalid }) => !isInvalid && tw`text-theme-primary-600`};
	}
	.FormLabel {
		${({ isInvalid }) => isInvalid && tw`text-theme-danger-500`};
	}
	&:focus-within .FormLabel {
		${({ isInvalid }) => (isInvalid ? tw`text-theme-danger-500` : tw`text-theme-primary-600`)}
	}
`;

export function FormField({ name, ...props }: FormFieldProps) {
	const FormProvider = useFormContext();
	const { isInvalid, errorMessage } = React.useMemo(() => {
		const error: { message: string } | undefined = get(FormProvider?.errors, name);

		return {
			isInvalid: !!error,
			errorMessage: error?.message,
		};
	}, [FormProvider, name]);

	return (
		<FormFieldStyled isInvalid={isInvalid} className="flex flex-col space-y-2" {...props}>
			<FormFieldProvider value={{ isInvalid, name, errorMessage }}>{props.children}</FormFieldProvider>
		</FormFieldStyled>
	);
}
