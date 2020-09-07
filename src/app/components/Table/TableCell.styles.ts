import tw from "twin.macro";

const baseStyle = [tw`flex items-center my-1 h-20 transition-colors duration-100 group-hover:bg-theme-neutral-100`];

const getHoverStyles = (isSelected?: boolean): any => (isSelected ? tw`bg-theme-success-100` : "");

const getVariant = (variant: "start" | "middle" | "end"): any => {
	if (variant === "start") {
		return tw`rounded-l-lg -ml-4 pl-4`;
	}

	if (variant === "end") {
		return tw`rounded-r-lg -mr-4 pr-4`;
	}
};

export const getStyles = ({ isSelected, variant }: any) => [
	...baseStyle,
	getHoverStyles(isSelected),
	getVariant(variant),
];
