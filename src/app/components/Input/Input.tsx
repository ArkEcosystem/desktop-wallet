import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useEffect, useRef } from "react";
import tw, { styled } from "twin.macro";

import { useFormField } from "../Form/useFormField";

type InputProps = {
	as?: React.ElementType;
	ignoreContext?: boolean;
	isInvalid?: boolean;
	isFocused?: boolean;
	hideInputValue?: boolean;
	suggestion?: string;
	errorMessage?: string;
	innerClassName?: string;
	addons?: any;
} & React.HTMLProps<any>;

export const InputWrapperStyled = styled.div<{ disabled?: boolean; invalid?: boolean }>`
	${tw`flex items-center w-full px-4 py-3 space-x-2 overflow-hidden transition-colors duration-200 border rounded appearance-none h-14 text-theme-text focus-within:ring-1`}

	${({ disabled, invalid }) => {
		if (disabled) {
			return tw`border-theme-secondary-300 dark:border-theme-secondary-700 bg-theme-secondary-100 dark:bg-theme-secondary-800`;
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
		{
			isInvalid,
			className,
			innerClassName,
			isFocused,
			ignoreContext,
			errorMessage,
			addons,
			disabled,
			suggestion,
			hideInputValue,
			style,
			...props
		}: InputProps,
		ref,
	) => {
		let fieldContext = useFormField();

		if (ignoreContext) {
			fieldContext = undefined;
		}

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
					<span data-errortext={errorMessageValue} data-testid="Input__error">
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
				<InputWrapperStyled style={style} className={className} disabled={disabled} invalid={isInvalidValue}>
					{addons?.start !== undefined && addons.start}

					<div className={cn("relative flex flex-1", { invisible: hideInputValue })}>
						<InputStyled
							data-testid="Input"
							className={cn(
								"p-0 border-none bg-transparent focus:ring-0 no-ligatures w-full",
								innerClassName,
								{ "text-theme-secondary-text": disabled },
							)}
							name={fieldContext?.name}
							aria-invalid={isInvalidValue}
							disabled={disabled}
							ref={ref}
							{...props}
						/>

						{suggestion && (
							<span
								data-testid="Input__suggestion"
								className={cn(
									"absolute top-0 flex items-center font-normal opacity-50 pointer-events-none",
									innerClassName,
								)}
							>
								{suggestion}
							</span>
						)}
					</div>

					{(isInvalidValue || addons?.end) && (
						<div
							className={cn(
								"flex items-center space-x-3 divide-x divide-theme-secondary-300 dark:divide-theme-secondary-800",
								{
									"text-theme-danger-500": isInvalidValue,
									"text-theme-primary-300 dark:text-theme-secondary-600": !isInvalidValue,
								},
							)}
						>
							{isInvalidValue && (
								<Tooltip content={errorMessageValue} variant="sm">
									<span data-errortext={errorMessageValue} data-testid="Input__error">
										<Icon
											name={"AlertWarning"}
											className="text-theme-danger-500"
											width={20}
											height={20}
										/>
									</span>
								</Tooltip>
							)}

							{addons?.end && <div className={cn({ "pl-3": isInvalidValue })}>{addons.end}</div>}
						</div>
					)}
				</InputWrapperStyled>
			</>
		);
	},
);

Input.displayName = "Input";
Input.defaultProps = {};
