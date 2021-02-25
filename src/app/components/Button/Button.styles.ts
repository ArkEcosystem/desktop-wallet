import tw, { css } from "twin.macro";
import { ButtonVariant, Size } from "types";

const baseStyle = [
	tw`inline-flex items-center justify-center font-semibold text-center transition-all duration-100 ease-linear rounded leading-tight focus:ring-inset focus:ring-2 focus:ring-theme-secondary-300 focus:outline-none`,
	css`
		&:disabled {
			${tw`cursor-not-allowed`},
		}
	`,
];

const getVariant = (variant: ButtonVariant, disabled: boolean): any => {
	if (disabled) {
		return variant === "transparent"
			? tw`disabled:(text-theme-secondary-400 dark:text-theme-secondary-700)`
			: tw`disabled:(bg-theme-secondary-200 text-theme-secondary-400 dark:bg-theme-secondary-800 dark:text-theme-secondary-700)`;
	}

	switch (variant) {
		case "primary":
			return tw`bg-theme-primary-600 hover:bg-theme-primary-700 text-white`;
		case "secondary":
			return tw`bg-theme-primary-100 hover:bg-theme-primary-700 dark:bg-theme-secondary-800 text-theme-primary-600 dark:text-theme-secondary-200 hover:text-white`;
		case "danger":
			return tw`bg-theme-danger-100 dark:bg-theme-danger-400 hover:bg-theme-danger-400 hover:dark:bg-theme-danger-500 text-theme-danger-400 dark:text-white hover:text-white`;
		default:
			return tw`bg-transparent border-none`;
	}
};

const getSize = (size?: Size): any => {
	switch (size) {
		case "sm":
			return tw`px-3 py-2 space-x-2 text-sm`;
		case "lg":
			return tw`px-6 py-4 space-x-4`;
		case "icon":
			return tw`p-3`;
		default:
			return tw`px-5 py-3 space-x-3 text-base`;
	}
};

export const getStyles = ({
	variant,
	size,
	disabled,
}: {
	variant?: ButtonVariant;
	size?: Size;
	disabled?: boolean;
}) => [getSize(size), ...baseStyle, getVariant(variant!, disabled!)];
