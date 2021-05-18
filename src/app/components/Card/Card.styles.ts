import tw, { css, styled } from "twin.macro";

export const CardButton = styled.button<{ isSelected?: boolean; onClick?: any }>`
	${tw`bg-theme-background relative w-full h-full text-left transition-all duration-200 p-6 border-2 rounded-lg cursor-default`}
	${css`
		&.focus-visible {
			${tw`outline-none border-theme-primary-400!`}
		}
	`}
	${({ onClick }) =>
		typeof onClick === "function" && tw`cursor-pointer outline-none hover:(border-theme-background shadow-xl)`}
	${({ isSelected }) =>
		isSelected
			? tw`bg-theme-success-100 border-theme-success-600 hover:border-theme-success-100`
			: tw`bg-theme-background border-theme-primary-100 dark:border-theme-secondary-800`}
`;
