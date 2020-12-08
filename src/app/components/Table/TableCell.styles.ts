import tw from "twin.macro";

const baseStyle = tw`flex items-center px-3 my-1 transition-colors duration-100`;

const getHeight = (isCompact?: boolean): any => (isCompact ? tw`h-16` : tw`h-20`);

const getHoverStyles = (isSelected?: boolean): any => [
	tw`group-hover:bg-theme-neutral-100 dark:group-hover:bg-theme-neutral-800`,
	isSelected ? tw`bg-theme-success-100 dark:bg-theme-success-900` : "",
];

const getVariant = (variant: "start" | "middle" | "end"): any => {
	if (variant === "start") {
		return tw`pl-4 -ml-4 rounded-l-lg`;
	}

	if (variant === "end") {
		return tw`pr-4 -mr-4 rounded-r-lg`;
	}
};

export const getStyles = ({ variant, noHover, isSelected, isCompact }: any) => {
	const styles = [baseStyle, getHeight(isCompact), getVariant(variant)];

	if (!noHover) {
		styles.push(...getHoverStyles(isSelected));
	}

	return styles;
};
