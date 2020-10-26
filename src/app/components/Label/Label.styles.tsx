import tw from "twin.macro";
import { Size } from "types";

const baseStyle = tw`inline-block font-semibold border-2 rounded`;

const getColors = (name: string, variant?: string): any => {
	if (variant === "solid") {
		switch (name) {
			case "primary":
				return tw`text-theme-primary-500 border-theme-primary-100 bg-theme-primary-100`;
			case "success":
				return tw`text-theme-success-600 border-theme-success-200 bg-theme-success-200`;
			case "danger":
				return tw`text-theme-danger-500 border-theme-danger-100 bg-theme-danger-100`;
			default:
				// warning
				return tw`text-theme-warning-700 border-theme-warning-100 bg-theme-warning-100`;
		}
	}

	switch (name) {
		case "primary":
			return tw`text-theme-primary-500 border-theme-primary-100 dark:border-theme-primary-500`;
		case "success":
			return tw`text-theme-success-600 border-theme-success-200 dark:border-theme-success-600`;
		case "danger":
			return tw`text-theme-danger-400 border-theme-danger-100 dark:border-theme-danger-400`;
		default:
			// warning
			return tw`text-theme-warning-700 border-theme-danger-100 dark:border-theme-warning-700`;
	}
};

const getSize = (size?: Size): any => {
	switch (size) {
		case "lg":
			return tw`px-2 text-lg`;
		default:
			return tw`px-2 text-base`;
	}
};

export const getStyles = ({ color, size, variant }: { color?: string; size?: Size; variant?: string }) => [
	getSize(size),
	baseStyle,
	getColors(color!, variant),
];
