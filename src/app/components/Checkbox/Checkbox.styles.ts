import tw, { css } from "twin.macro";
import { Color } from "types";

const baseStyle = [
	tw`w-4 h-4 transition duration-150 ease-in-out rounded focus:ring-offset-0 border-theme-secondary-300`,
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

const getVariant = (variant?: any) => {
	switch (variant) {
		case "thick":
			return [tw`border-2`];
		default:
			return [];
	}
};

export const getStyles = ({ color, variant }: { color?: Color; variant?: string }) => [
	...baseStyle,
	...getColor(color!),
	...getVariant(variant!),
];
