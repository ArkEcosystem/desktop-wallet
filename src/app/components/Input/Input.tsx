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
	isTextArea?: boolean;
	hideInputValue?: boolean;
	suggestion?: string;
	errorMessage?: string;
	innerClassName?: string;
	noBorder?: boolean;
	noShadow?: boolean;
	addons?: any;
} & React.HTMLProps<any>;

export const InputWrapperStyled = styled.div<{
	disabled?: boolean;
	invalid?: boolean;
	noBorder?: boolean;
	noShadow?: boolean;
	isTextArea?: boolean;
}>`
	${tw`flex items-center w-full px-4 space-x-2 transition-colors duration-200 rounded appearance-none text-theme-text`}

	${({ noBorder }) => {
		if (!noBorder) {
			return tw`border`;
		}
	}}

	${({ noShadow }) => {
		if (!noShadow) {
			return tw`focus-within:ring-1`;
		}
	}}

	${({ disabled, invalid }) => {
		if (disabled) {
			return tw`border-theme-secondary-300 dark:border-theme-secondary-700 bg-theme-secondary-100 dark:bg-theme-secondary-800`;
		}

		if (invalid) {
			return tw`bg-theme-background border-theme-danger-500 focus-within:ring-theme-danger-500`;
		}

		return tw`bg-theme-background border-theme-secondary-400 dark:border-theme-secondary-700 focus-within:(border-theme-primary-600 ring-theme-primary-600)`;
	}}

	${({ isTextArea }) => {
		if (isTextArea) {
			return tw`relative`;
		}

		return tw`h-14 overflow-hidden`;
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
			isTextArea,
			ignoreContext,
			errorMessage,
			addons,
			disabled,
			noBorder,
			noShadow,
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

		return (
			<>
				<InputWrapperStyled
					style={style}
					className={className}
					disabled={disabled}
					invalid={isInvalidValue}
					noBorder={noBorder}
					noShadow={noShadow}
					isTextArea={isTextArea}
				>
					{addons?.start !== undefined && addons.start}

					<div className={cn("relative flex flex-1 h-full", { invisible: hideInputValue })}>
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
									"absolute inset-y-0 flex items-center font-normal opacity-50 pointer-events-none",
									innerClassName,
								)}
							>
								{suggestion}
							</span>
						)}
					</div>

					{(isInvalidValue || addons?.end) && (
						<div
							className={cn("flex items-center space-x-3 divide-x", {
								"divide-theme-danger-500 text-theme-danger-500": isInvalidValue,
								"divide-theme-secondary-300 dark:divide-theme-secondary-800 text-theme-primary-300 dark:text-theme-secondary-600": !isInvalidValue,
								"absolute bottom-full right-0 mb-2": isTextArea,
							})}
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
