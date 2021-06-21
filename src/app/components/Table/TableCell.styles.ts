import tw from "twin.macro";

const baseStyle = tw`flex items-center px-3 my-1 transition-colors duration-100`;

const getHeight = (isCompact: boolean) => (isCompact ? tw`h-10` : tw`h-16`);

const getVariant = (variant: "start" | "middle" | "end"): any => {
	if (variant === "start") {
		return tw`pl-4 -ml-4 rounded-l-xl`;
	}

	if (variant === "end") {
		return tw`pr-4 -mr-4 rounded-r-xl`;
	}
};

export const getStyles = ({ variant, isCompact }: any) => [baseStyle, getHeight(isCompact), getVariant(variant)];
