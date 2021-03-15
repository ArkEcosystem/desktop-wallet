import tw from "twin.macro";
import { Size } from "types";

const baseStyle = tw`flex flex-col space-y-3 items-center justify-center transition-all duration-200 overflow-hidden`;

const getSize = (size?: Size): any => {
	switch (size) {
		case "xs":
			return tw`flex-shrink-0 h-6 w-6 rounded`;
		case "sm":
			return tw`flex-shrink-0 h-15 w-15 rounded-lg`;
		case "lg":
			return tw`flex-shrink-0 h-44 w-44 rounded-3xl`;
		default:
			return tw`flex-shrink-0 h-25 w-25 rounded-xl`;
	}
};

const getVariant = (variant?: string): any => {
	if (variant === "progress") {
		return tw`border border-theme-secondary-300 dark:border-theme-secondary-800 bg-theme-success-100 dark:bg-theme-success-900`;
	}
};

export const getStyles = ({ size, variant }: { size?: Size; variant?: string }) => [
	baseStyle,
	getSize(size),
	getVariant(variant),
];
