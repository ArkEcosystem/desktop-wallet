import tw, { css } from "twin.macro";
import { Color, Size } from "types";

const baseStyle = [
	tw`animate-spin rounded-full border border-theme-secondary-200 dark:border-black`,
	css`
		border-width: 5px;
	`,
];

const getColor = (color: Color): any => {
	const baseColors: Record<Color, string> = {
		info: "primary-600",
		success: "success-600",
		warning: "warning-600",
		danger: "danger-400",
		hint: "hint-500",
	};

	return css`
		border-left-color: var(--theme-color-${baseColors[color]}) !important;
	`;
};

const getSize = (size?: Size): any => {
	switch (size) {
		case "sm":
			return tw`w-5 h-5`;
		case "lg":
			return tw`w-12 h-12`;
		default:
			return tw`w-8 h-8`;
	}
};

export const getStyles = ({ color, size }: { color?: Color; size?: Size }) => [
	...baseStyle,
	getSize(size),
	...getColor(color!),
];
