import tw, { css } from "twin.macro";
import { Color } from "types";

const baseStyle = [
	tw`w-4 h-4 transition duration-150 ease-in-out cursor-pointer focus:ring-offset-0 border-theme-secondary-300`,
];

const getColor = (color: Color) => {
	const baseColors: Record<string, string> = {
		info: "primary-600",
		success: "success-600",
		warning: "warning-600",
		danger: "danger-400",
		hint: "hint-500",
	};

	return css`
		color: var(--theme-color-${baseColors[color]});
	`;
};

export const getStyles = ({ color }: { color?: Color }) => [...baseStyle, ...getColor(color!)];
