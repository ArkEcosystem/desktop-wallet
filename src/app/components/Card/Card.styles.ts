import tw, { styled } from "twin.macro";

export const Wrapper = styled.div<{ isSelected?: boolean; onClick?: any }>`
	${tw`bg-theme-background relative transition-all duration-200 p-6 border-2 rounded-lg`}
	${({ onClick }) =>
		typeof onClick === "function" && tw`cursor-pointer hover:border-theme-background hover:shadow-xl`}
	${({ isSelected }) =>
		isSelected
			? tw`bg-theme-success-100 border-theme-success-600 hover:border-theme-success-100`
			: tw`bg-theme-background border-theme-primary-100 dark:border-theme-secondary-800`}
`;
