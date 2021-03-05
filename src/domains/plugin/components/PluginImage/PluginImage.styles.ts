import tw from "twin.macro";
import { Size } from "types";

const baseStyle = tw`transition-all duration-200 overflow-hidden`;

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

export const getStyles = ({ size }: { size?: Size }) => [getSize(size), baseStyle];
