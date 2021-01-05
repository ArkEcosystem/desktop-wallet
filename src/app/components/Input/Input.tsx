import React from "react";
import tw, { styled } from "twin.macro";

import { useFormField } from "../Form/useFormField";

type InputProps = { as?: React.ElementType; isInvalid?: boolean } & React.HTMLProps<any>;

const InputStyled = styled.input`
	&:focus {
		${tw`outline-none border-theme-primary`}
		box-shadow: 0 0 0 1px var(--theme-color-primary);
	}
	&::placeholder {
		${tw`text-theme-neutral-400 dark:text-theme-neutral-700`}
	}
	&:disabled {
		${tw`border-theme-neutral-300 dark:border-theme-neutral-700 bg-theme-neutral-100 dark:bg-theme-neutral-800 text-theme-secondary-text`}
	}
	&[aria-invalid="true"] {
		${tw`border-theme-danger-500`}
		&:focus {
			box-shadow: 0 0 0 1px var(--theme-color-danger-500);
		}
	}
	&.shadow-none {
		${tw`shadow-none`}
	}
`;

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const Input = React.forwardRef<InputElement, InputProps>(
	({ isInvalid, className, ...props }: InputProps, ref) => {
		const fieldContext = useFormField();

		return (
			<InputStyled
				data-testid="Input"
				className={`overflow-hidden w-full bg-theme-background appearance-none rounded border border-theme-neutral-400 dark:border-theme-neutral-700 text-theme-text transition-colors duration-200 px-4 py-3 ${
					className || ""
				}`}
				name={fieldContext?.name}
				aria-invalid={fieldContext?.isInvalid || isInvalid}
				ref={ref}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";
Input.defaultProps = {};
