import React from "react";
import tw, { css, styled } from "twin.macro";

export const ButtonGroup = ({ children }: React.PropsWithChildren<{}>) => (
	<div data-testid="ButtonGroup" role="radiogroup" className="inline-flex items-center space-x-2 w-full">
		{children}
	</div>
);

const ButtonGroupOptionStyled = styled.button(() => [
	tw`flex items-center justify-center w-full h-full`,
	tw`px-5 py-4 focus:outline-none font-semibold text-theme-secondary-700 `,
	tw`rounded border-2 border-theme-primary-100`,
	tw`transition-colors duration-300`,
	tw`dark:(border-theme-secondary-800 text-theme-secondary-200)`,
	tw`focus:(outline-none ring-2 ring-theme-primary-400)`,
	tw`disabled:(
		border border-theme-secondary-300 text-theme-secondary-500 cursor-not-allowed
		dark:(text-theme-secondary-700 border-theme-secondary-700)
	)`,
	css`
		&[aria-checked="true"] {
			${tw`text-theme-text border-theme-success-600 bg-theme-success-100 dark:bg-theme-success-900`}
		}
	`,
]);

interface ButtonGroupOptionProperties {
	children: React.ReactNode;
	value: string | number;
	disabled?: boolean;
	isSelected: (value: string | number) => boolean;
	setSelectedValue: (value: string | number) => void;
}

export const ButtonGroupOption = ({
	value,
	disabled,
	isSelected,
	setSelectedValue,
	children,
}: ButtonGroupOptionProperties) => (
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
