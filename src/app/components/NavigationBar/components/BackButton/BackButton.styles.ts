import tw from "twin.macro";

const baseStyles = tw`flex items-center w-12 transition-colors duration-200 bg-theme-secondary-100 dark:bg-black`;

const getVariant = (disabled?: boolean) => {
	if (disabled) {
		return tw`text-theme-secondary-500 dark:text-theme-secondary-800 cursor-not-allowed`;
	}

	return tw`
		text-theme-primary-600
		dark:text-theme-secondary-200
		hover:(bg-theme-primary-100 dark:bg-theme-secondary-800)
		focus:(outline-none ring-2 ring-inset ring-theme-primary-400 rounded)
	`;
};

export const getStyles = ({ disabled }: { disabled?: boolean }) => [baseStyles, getVariant(disabled)];
