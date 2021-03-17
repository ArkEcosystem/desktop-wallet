import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useEffect, useRef } from "react";
import tw, { styled } from "twin.macro";

import { useFormField } from "../Form/useFormField";

type InputProps = {
	as?: React.ElementType;
	isInvalid?: boolean;
	isFocused?: boolean;
	errorMessage?: string;
	errorClassName?: string;
	addons?: any;
} & React.HTMLProps<any>;

export const InputWrapperStyled = styled.div<{ disabled?: boolean; invalid?: boolean }>`
	${tw`flex items-center h-14 px-4 py-3 space-x-2 overflow-hidden w-full appearance-none rounded border text-theme-text transition-colors duration-200 focus-within:ring-1`}

	${({ disabled, invalid }) => {
		if (disabled) {
			return tw`border-theme-secondary-300 dark:border-theme-secondary-700`;
		}

		if (invalid) {
			return tw`border-theme-danger-500 focus-within:ring-theme-danger-500`;
		}

		return tw`border-theme-secondary-400 dark:border-theme-secondary-700 focus-within:ring-theme-primary-600`;
	}}
`;

const InputStyled = styled.input`
	&:focus {
		${tw`outline-none`}
	}
	&::placeholder {
		${tw`text-theme-secondary-400 dark:text-theme-secondary-700`}
	}
	&.shadow-none {
		${tw`shadow-none`}
	}
`;

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const Input = React.forwardRef<InputElement, InputProps>(
	(
		{ isInvalid, className, isFocused, errorClassName, errorMessage, addons, disabled, ...props }: InputProps,
		ref,
	) => {
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

		const addonsEnd: any = [];

		if (isInvalidValue) {
			addonsEnd.push(
				<Tooltip content={errorMessageValue} variant="sm">
					<span data-errortext={errorMessageValue} data-testid="Input-error">
						<Icon name={"AlertWarning"} className="text-theme-danger-500" width={20} height={20} />
					</span>
				</Tooltip>,
			);
		}

		if (addons?.end) {
			addonsEnd.push(addons.end);
		}

		return (
			<>
				<InputWrapperStyled className={className} disabled={disabled} invalid={isInvalidValue}>
					{addons?.start !== undefined && addons.start}

					<InputStyled
						data-testid="Input"
						className={cn("flex-1 p-0 border-none bg-transparent focus:ring-0 no-ligatures", {
							"dark:bg-theme-secondary-800 text-theme-secondary-text": disabled,
						})}
						name={fieldContext?.name}
						aria-invalid={isInvalidValue}
						disabled={disabled}
						ref={ref}
						{...props}
					/>

					{(isInvalidValue || addons?.end) && (
						<div
							className={cn(
								"flex items-center space-x-2 divide-x divide-theme-secondary-300 dark:divide-theme-secondary-800",
								{
									"text-theme-danger-500": isInvalidValue,
									"text-theme-primary-300 dark:text-theme-secondary-600": !isInvalidValue,
								},
							)}
						>
							{isInvalidValue && (
								<Tooltip content={errorMessageValue} variant="sm">
									<span data-errortext={errorMessageValue} data-testid="Input-error">
										<Icon
											name={"AlertWarning"}
											className="text-theme-danger-500"
											width={20}
											height={20}
										/>
									</span>
								</Tooltip>
							)}

							{addons?.end && <div className={cn({ "pl-2": isInvalidValue })}>{addons.end}</div>}
						</div>
					)}
				</InputWrapperStyled>
			</>
		);
	},
);

Input.displayName = "Input";
Input.defaultProps = {};
