import React from "react";
import tw, { styled } from "twin.macro";

type ButtonGroupProps = {
	children?: React.ReactNode;
};

export const ButtonGroup = ({ children }: ButtonGroupProps) => (
	<div
		data-testid="ButtonGroup"
		role="radiogroup"
		className="inline-flex overflow-hidden items-center space-x-2"
	>
		{children}
	</div>
);

const ButtonGroupOptionStyled = styled.button`
	& {
		${tw`text-xs flex items-center px-4 h-full transition-colors duration-300 focus:outline-none rounded font-bold border-2 border-theme-primary-100 dark:border-theme-secondary-800 text-theme-secondary-600`};
	}
	&[aria-checked="true"] {
		${tw`border-theme-success-600 bg-theme-success-100 dark:bg-theme-success-900`}
	}
	&:disabled {
		${tw`cursor-not-allowed`},
	}
`;

type ButtonGroupOptionProps = {
	children: React.ReactNode;
	value: string | number;
	disabled?: boolean;
	isSelected: (value: string | number) => boolean;
	setSelectedValue: (value: string | number) => void;
};

export const ButtonGroupOption = ({ value, disabled, isSelected, setSelectedValue, children }: ButtonGroupOptionProps) => (
	<ButtonGroupOptionStyled
		disabled={disabled}
		type="button"
		data-testid="ButtonGroupOption"
		role="radio"
		aria-checked={isSelected(value)}
		onClick={() => setSelectedValue(value)}
	>
		{children}
	</ButtonGroupOptionStyled>
);
