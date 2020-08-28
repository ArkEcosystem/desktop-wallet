import React from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormProps = {
	onSubmit: (data: object) => void;
	context: ReturnType<typeof useForm>;
} & Omit<React.FormHTMLAttributes<any>, "onSubmit">;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
	({ children, context, onSubmit, ...props }: FormProps, ref) => (
		<FormProvider {...context}>
			<form
				data-testid="Form"
				ref={ref}
				className="space-y-8"
				onSubmit={context.handleSubmit(onSubmit)}
				{...props}
			>
				{children}
			</form>
		</FormProvider>
	),
);

Form.displayName = "Form";
