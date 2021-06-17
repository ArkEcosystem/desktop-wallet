import React from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormProperties = {
	onSubmit: (data: object) => void;
	context: ReturnType<typeof useForm>;
} & Omit<React.FormHTMLAttributes<any>, "onSubmit">;

export const Form = React.forwardRef<HTMLFormElement, FormProperties>(
	({ children, context, onSubmit, ...properties }: FormProperties, reference) => (
		<FormProvider {...context}>
			<form
				data-testid="Form"
				ref={reference}
				className="space-y-5"
				onSubmit={context.handleSubmit(onSubmit)}
				{...properties}
			>
				{children}
			</form>
		</FormProvider>
	),
);

Form.displayName = "Form";
