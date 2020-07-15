import React from "react";
import tw, { styled } from "twin.macro";

import { useFormField } from "../Form/useFormField";

type InputProps = { as?: React.ElementType; isInvalid?: boolean } & React.HTMLProps<any>;

const InputStyled = styled.input`
	&:focus {
		${tw`border-2 outline-none border-theme-primary -m-px`}
	}
	&::placeholder {
		${tw`text-theme-neutral-light`}
	}
	&:disabled {
		${tw`border-theme-neutral-300 bg-theme-neutral-contrast text-theme-neutral-dark`}
	}
	&[aria-invalid="true"] {
		${tw`border-theme-danger`}
	}
`;

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const Input = React.forwardRef<InputElement, InputProps>(
	({ isInvalid, className, ...props }: InputProps, ref) => {
		const fieldContext = useFormField();

		return (
			<InputStyled
				data-testid="Input"
				className={`overflow-hidden w-full bg-theme-background appearance-none rounded border border-theme-neutral-300 text-theme-neutral-900 transition-colors duration-200 px-4 py-3 ${
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
