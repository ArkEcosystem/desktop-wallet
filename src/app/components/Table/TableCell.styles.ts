import tw from "twin.macro";

const baseStyle = tw`flex items-center px-3 my-1 transition-colors duration-100`;

const getHeight = (isCompact?: boolean): any => (isCompact ? tw`h-16` : tw`h-20`);

const getVariant = (variant: "start" | "middle" | "end"): any => {
	if (variant === "start") {
		return tw`pl-4 -ml-4 rounded-l-lg`;
	}

	if (variant === "end") {
		return tw`pr-4 -mr-4 rounded-r-lg`;
	}
};

export const getStyles = ({ variant, isSelected, isCompact }: any) => [
	baseStyle,
	getHeight(isCompact),
	getVariant(variant),
];
