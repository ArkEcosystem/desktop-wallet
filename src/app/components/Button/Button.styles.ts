import tw, { css } from "twin.macro";
import { ButtonVariant, Size } from "types";

// @TODO add focus-visible:shadow-outline
const baseStyle = [
	tw`inline-flex items-center justify-center font-semibold text-center transition-all duration-100 ease-linear rounded focus:outline-none`,
	css`
		line-height: 1.25;
		&:disabled {
			${tw`cursor-not-allowed bg-theme-neutral-200 text-theme-neutral-light dark:bg-theme-neutral-800 dark:text-theme-neutral-700`}
		}
	`,
];

const getVariant = (variant: ButtonVariant, disabled: boolean): any => {
	if (disabled) return;

	switch (variant) {
		case "primary":
			return tw`bg-theme-primary hover:bg-theme-primary-700 dark:bg-theme-neutral-800 text-white dark:text-theme-neutral-200 hover:dark:text-white`;
		case "secondary":
			return tw`bg-theme-primary-100 hover:bg-theme-primary-700 dark:bg-theme-neutral-800 text-theme-primary-600 dark:text-theme-neutral-200 hover:text-white`;
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
			return tw`px-6 py-4 space-x-4 text-lg`;
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
