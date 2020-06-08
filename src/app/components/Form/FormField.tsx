import React from "react";
import { FormFieldProvider } from "./useFormField";
import { useFormContext } from "react-hook-form";
import tw, { styled } from "twin.macro";

type FormFieldProps = {
	name: string;
} & React.FieldsetHTMLAttributes<any>;

export const FormFieldStyled = styled.fieldset<{ isInvalid: boolean }>`
	&:hover .FormLabel {
		${({ isInvalid }) => !isInvalid && tw`text-theme-primary`};
	}
	.FormLabel {
		${({ isInvalid }) => isInvalid && tw`text-theme-danger`};
	}
	&:focus-within .FormLabel {
		${({ isInvalid }) => (isInvalid ? tw`text-theme-danger` : tw`text-theme-primary`)}
	}
`;

export function FormField({ name, ...props }: FormFieldProps) {
	const formContext = useFormContext();
	const { isInvalid, errorMessage } = React.useMemo(() => {
		const error = formContext?.errors[name];
		return {
			isInvalid: !!error,
			errorMessage: error?.message,
		};
	}, [formContext, name]);

	return (
		<FormFieldStyled isInvalid={isInvalid} className="flex flex-col space-y-2" {...props}>
			<FormFieldProvider value={{ isInvalid, name, errorMessage }}>{props.children}</FormFieldProvider>
		</FormFieldStyled>
	);
}
