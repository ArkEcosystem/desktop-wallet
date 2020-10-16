import tw from "twin.macro";

const baseStyle = [
	tw`flex items-center h-20 px-3 my-1 transition-colors duration-100 group-hover:bg-theme-neutral-100`,
];

const getHoverStyles = (isSelected?: boolean): any => (isSelected ? tw`bg-theme-success-100` : "");

const getVariant = (variant: "start" | "middle" | "end"): any => {
	if (variant === "start") {
		return tw`pl-4 -ml-4 rounded-l-lg`;
	}

	if (variant === "end") {
		return tw`pr-4 -mr-4 rounded-r-lg`;
	}
};

export const getStyles = ({ isSelected, variant }: any) => [
	...baseStyle,
	getHoverStyles(isSelected),
	getVariant(variant),
];
