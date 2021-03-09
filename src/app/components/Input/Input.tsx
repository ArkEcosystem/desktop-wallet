import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useEffect, useRef } from "react";
import tw, { styled } from "twin.macro";

import { useFormField } from "../Form/useFormField";
import { InputAddonEnd } from "./InputGroup";

type InputProps = {
	as?: React.ElementType;
	isInvalid?: boolean;
	isFocused?: boolean;
	errorMessage?: string;
	errorClassName?: string;
} & React.HTMLProps<any>;

const InputStyled = styled.input`
	&:focus {
		${tw`outline-none border-theme-primary-600`}
		box-shadow: 0 0 0 1px var(--theme-color-primary-600);
	}
	&::placeholder {
		${tw`text-theme-secondary-400 dark:text-theme-secondary-700`}
	}
	&:disabled {
		${tw`border-theme-secondary-300 dark:border-theme-secondary-700 bg-theme-secondary-100 dark:bg-theme-secondary-800 text-theme-secondary-text`}
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
	({ isInvalid, className, isFocused, errorClassName, errorMessage, ...props }: InputProps, ref) => {
		const fieldContext = useFormField();

		const isInvalidValue = fieldContext?.isInvalid || isInvalid;
		const errorMessageValue = fieldContext?.errorMessage || errorMessage;

		const focusRef = useRef<InputElement>(null);
		ref = isFocused ? focusRef : ref;
		useEffect(() => {
			if (isFocused && focusRef.current) {
				focusRef.current.focus();
			}
		}, [focusRef, isFocused]);

		return (
			<>
				<InputStyled
					data-testid="Input"
					className={cn(
						"overflow-hidden w-full bg-theme-background appearance-none rounded border border-theme-secondary-400 dark:border-theme-secondary-700 text-theme-text transition-colors duration-200 px-4 py-3 no-ligatures",
						className,
					)}
					name={fieldContext?.name}
					aria-invalid={isInvalidValue}
					ref={ref}
					{...props}
				/>

				{isInvalidValue && (
					<InputAddonEnd className={cn("my-px mr-4", errorClassName)}>
						<Tooltip content={errorMessageValue} variant="sm">
							<span data-errortext={errorMessageValue} data-testid="Input-error">
								<Icon name={"AlertWarning"} className="text-theme-danger-500" width={20} height={20} />
							</span>
						</Tooltip>
					</InputAddonEnd>
				)}
			</>
		);
	},
);

Input.displayName = "Input";
Input.defaultProps = {};
